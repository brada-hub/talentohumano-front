import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'
import api from 'src/shared/api/axios.instance'
import { getFileSizeError } from 'src/shared/utils/formValidators'

type StoredFile = File & {
  __fromServer?: boolean
  __fromServerUrl?: string
}

export const useOnboardingStore = defineStore('onboarding', {
  state: () => ({
    sessionKey: LocalStorage.getItem('onboarding_session_key') || '',
    persona: LocalStorage.getItem('onboarding_persona') || { id_pais: 2, id_sexo: 1, id_expedido: null } as any,
    beneficiarios: LocalStorage.getItem('onboarding_beneficiarios') || [] as any[],
    academico: LocalStorage.getItem('onboarding_academico') || [] as any[],
    experiencia: LocalStorage.getItem('onboarding_experiencia') || [] as any[],
    otros: LocalStorage.getItem('onboarding_otros') || [] as any[],
    archivos: LocalStorage.getItem('onboarding_archivos') || { ci_escaneado: null } as any,
    loading: false,
    paises: [] as any[],
    nacionalidades: [] as any[],
    expedidos: [] as any[],
    parentescos: [] as any[],
    departamentos: [] as any[],
    ciudades: [] as any[],
    cajas: [] as any[],
    pensiones: [] as any[],
  }),

  getters: {
    isPersonaComplete: (state) => {
      const p = state.persona
      const ciEscaneado = state.archivos?.ci_escaneado
      return !!(p.nombres && p.primer_apellido && p.ci && p.fecha_nacimiento && ciEscaneado)
    }
  },

  actions: {
    saveToLocal() {
      const persistFileRef = (file: any) => {
        if (!file) return null
        if (typeof file === 'string') return file
        if (file.__fromServerUrl) return file.__fromServerUrl
        return null
      }

      LocalStorage.set('onboarding_persona', this.persona)
      LocalStorage.set('onboarding_beneficiarios', this.beneficiarios)
      LocalStorage.set('onboarding_academico', this.academico.map(i => ({
        ...i,
        archivo_respaldo: persistFileRef(i.archivo_respaldo),
        archivo_diploma: persistFileRef(i.archivo_diploma),
        archivo_titulo: persistFileRef(i.archivo_titulo),
      })))
      LocalStorage.set('onboarding_experiencia', this.experiencia.map(i => ({
        ...i,
        archivo_respaldo: persistFileRef(i.archivo_respaldo),
      })))
      LocalStorage.set('onboarding_otros', this.otros.map(i => ({
        ...i,
        archivo_respaldo: persistFileRef(i.archivo_respaldo),
      })))
      LocalStorage.set('onboarding_archivos', {
        ci_escaneado: persistFileRef(this.archivos?.ci_escaneado),
      })
    },

    async verificarIdentidad(payload: any) {
      this.loading = true
      this.resetData()
      try {
        const resp = await api.post('/portal/verificar', payload)
        if (resp.data.success) {
          const result = resp.data.data
          this.sessionKey = result.session_key || ''
          LocalStorage.set('onboarding_session_key', this.sessionKey)

          const pre = result.datos_precargados
          if (pre) {
            let fechaNac = pre.fecha_nacimiento || payload.fecha_nacimiento || ''
            if (fechaNac && fechaNac.includes('T')) fechaNac = fechaNac.split('T')[0]

            this.persona = {
              ...pre,
              id_expedido: pre.id_ci_expedido || pre.id_expedido || null,
              id_nacionalidad: pre.id_nacionalidad || 1,
              id_ciudad: pre.id_ciudad || null,
              id_depto_residencia: pre.id_depto_residencia || null,
              fecha_nacimiento: fechaNac,
              id_sexo: pre.id_sexo || 1,
              id_pais: pre.id_pais || 2,
            }

            this.beneficiarios = (pre.beneficiarios || []).map((i: any) => ({
              primer_apellido: i.primer_apellido || '',
              segundo_apellido: i.segundo_apellido || '',
              nombres: i.nombres || '',
              ci: i.ci || '',
              complemento: i.complemento || '',
              id_ci_expedido: i.id_ci_expedido || null,
              fecha_nacimiento: i.fecha_nacimiento ? String(i.fecha_nacimiento).slice(0, 10) : '',
              id_parentesco: i.id_parentesco || null,
            }))

            this.academico = (pre.formacion_pregrado || pre.formacionPregrado || []).map((i: any) => ({
              ...i,
              tipo_registro: 'pregrado',
              titulo: i.carrera,
              fecha_emision_diploma: i.fecha_diploma,
              fecha_emision: i.fecha_titulo
            })).concat((pre.formacion_postgrado || pre.formacionPostgrado || []).map((i: any) => ({
              ...i,
              tipo_registro: 'postgrado',
              titulo: i.nombre_programa,
              fecha_emision: i.fecha_certificacion || i.fecha_diploma
            })))

            this.experiencia = (pre.experiencia_docente || pre.experienciaDocente || []).map((i: any) => ({
              ...i,
              tipo_registro: 'docente'
            })).concat((pre.experiencia_profesional || pre.experienciaProfesional || []).map((i: any) => ({
              ...i,
              tipo_registro: 'profesional'
            })))

            this.otros = (pre.capacitaciones || []).map((i: any) => ({ ...i, tipo_registro: 'capacitacion' }))
              .concat((pre.idiomas || []).map((i: any) => ({ ...i, tipo_registro: 'idioma' })))
              .concat((pre.produccion_intelectual || pre.produccionIntelectual || []).map((i: any) => ({ ...i, tipo_registro: 'produccion' })))
              .concat((pre.reconocimientos || []).map((i: any) => ({ ...i, tipo_registro: 'reconocimiento' })))

            const urlToFile = async (url: string | null, filename: string, mimeType: string) => {
              if (!url) return null
              try {
                const cleanUrl = url.includes('storage/') ? url.split('storage/')[1] : url
                const res = await api.get(`/portal/archivo/${cleanUrl}`, { responseType: 'arraybuffer' })
                const file = new File([res.data], filename, { type: mimeType }) as StoredFile
                file.__fromServer = true
                file.__fromServerUrl = url
                return file
              } catch { return null }
            }

            if (pre.foto && !pre.foto.startsWith('data:')) {
              urlToFile(pre.foto, 'foto_perfil.jpg', 'image/jpeg').then(file => {
                if (file) {
                  const reader = new FileReader()
                  reader.onload = () => { this.persona.foto = reader.result as string }
                  reader.readAsDataURL(file)
                }
              })
            }

            if (pre.documentos && Array.isArray(pre.documentos)) {
              const ciDoc = pre.documentos.find((d: any) => d.tipo === 'ci' || d.tipo === 'ci_escaneado')
              if (ciDoc) {
                const mime = ciDoc.formato === 'pdf' ? 'application/pdf' : `image/${ciDoc.formato}`
                urlToFile(ciDoc.ruta_archivo, ciDoc.nombre_archivo, mime).then(file => {
                  if (file) this.archivos.ci_escaneado = file
                })
              }
            }

            const preLoadListFiles = (list: any[]) => {
              list.forEach(item => {
                if (item.archivo_diploma && typeof item.archivo_diploma === 'string') {
                  urlToFile(item.archivo_diploma, 'diploma.pdf', 'application/pdf').then(f => { if (f) item.archivo_diploma = f })
                }
                if (item.archivo_titulo && typeof item.archivo_titulo === 'string') {
                  urlToFile(item.archivo_titulo, 'titulo.pdf', 'application/pdf').then(f => { if (f) item.archivo_titulo = f })
                }
                if (item.archivo_respaldo && typeof item.archivo_respaldo === 'string') {
                  urlToFile(item.archivo_respaldo, 'respaldo.pdf', 'application/pdf').then(f => { if (f) item.archivo_respaldo = f })
                }
              })
            }

            preLoadListFiles(this.academico)
            preLoadListFiles(this.experiencia)
            preLoadListFiles(this.otros)
          } else {
            this.academico = []
            this.experiencia = []
            this.otros = []
            this.beneficiarios = []
            this.archivos = { ci_escaneado: null }

            this.persona = {
              id_pais: 2,
              id_sexo: 1,
              id_expedido: null,
              ci: payload.ci,
              fecha_nacimiento: payload.fecha_nacimiento,
              nombres: '',
              primer_apellido: '',
              segundo_apellido: '',
              correo_personal: '',
              celular_personal: '',
              direccion_domicilio: '',
              estado_civil: 'Soltero(a)',
              id_nacionalidad: 1,
              id_ciudad: null,
              id_depto_residencia: null
            }
          }

          this.saveToLocal()
          return result
        }
        return { success: false }
      } finally {
        this.loading = false
      }
    },

    async completarRegistro() {
      const fileToBase64 = (file: StoredFile): Promise<string> => new Promise((resolve, reject) => {
        if (file.__fromServer && file.__fromServerUrl) {
          resolve(file.__fromServerUrl)
          return
        }
        const fileError = getFileSizeError(file)
        if (fileError) {
          reject(new Error(fileError))
          return
        }
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = error => reject(error)
      })

      const normalizeAcademicoItem = (item: any) => {
        if (item?.tipo_registro === 'pregrado') {
          return {
            ...item,
            fecha_diploma: item.fecha_diploma || item.fecha_emision_diploma || null,
            fecha_titulo: item.fecha_titulo || item.fecha_emision || null,
          }
        }

        if (item?.tipo_registro === 'postgrado') {
          return {
            ...item,
            fecha_diploma: item.fecha_diploma || null,
            fecha_certificacion: item.fecha_certificacion || item.fecha_emision || null,
          }
        }

        return item
      }

      let ciEscaneadoB64 = this.archivos.ci_escaneado
      if (ciEscaneadoB64 instanceof File) {
        ciEscaneadoB64 = await fileToBase64(ciEscaneadoB64)
      }

      const processArrayFiles = async (arr: any[]) => {
        return Promise.all(arr.map(async (item) => {
          const newItem = { ...item }
          if (newItem.archivo_respaldo instanceof File) newItem.archivo_respaldo = await fileToBase64(newItem.archivo_respaldo)
          if (newItem.archivo_diploma instanceof File) newItem.archivo_diploma = await fileToBase64(newItem.archivo_diploma)
          if (newItem.archivo_titulo instanceof File) newItem.archivo_titulo = await fileToBase64(newItem.archivo_titulo)
          return newItem
        }))
      }

      const payload = {
        token: this.sessionKey,
        persona: this.persona,
        beneficiarios: this.beneficiarios,
        academico: (await processArrayFiles(this.academico)).map(normalizeAcademicoItem),
        experiencia: await processArrayFiles(this.experiencia),
        otros: await processArrayFiles(this.otros),
        archivos: { ci_escaneado: ciEscaneadoB64 }
      }

      const resp = await api.post('/portal/completar', payload)
      if (resp.data.success) {
        this.resetData()
      }
      return resp.data
    },

    resetData() {
      this.persona = {
        id_pais: 2,
        id_sexo: 1,
        id_expedido: 'CB',
        nombres: '',
        primer_apellido: '',
        segundo_apellido: '',
        ci: '',
        fecha_nacimiento: '',
        id_depto_residencia: null,
        id_ciudad: null,
        id_caja: null,
        id_entidad_pensiones: null,
        nro_matricula_seguro: '',
        nro_nua_cua: ''
      }
      this.beneficiarios = []
      this.academico = []
      this.experiencia = []
      this.otros = []
      this.archivos = { ci_escaneado: null }
      LocalStorage.clear()
    },

    async fetchPaises() {
      if (this.paises.length > 0) return
      const resp = await api.get('/v1/geo/paises')
      if (resp.data.success) {
        this.paises = resp.data.data.map((p: any) => ({ label: p.nombre, value: p.id_pais }))
      }
    },

    async fetchNacionalidades() {
      if (this.nacionalidades.length > 0) return
      const resp = await api.get('/v1/geo/nacionalidades')
      if (resp.data.success) {
        this.nacionalidades = resp.data.data.map((n: any) => ({ label: n.gentilicio, value: n.id_nacionalidad }))
      }
    },

    async fetchExpedidos() {
      if (this.expedidos.length > 0) return
      const resp = await api.get('/v1/geo/paises/2/departamentos')
      if (resp.data.success) {
        this.expedidos = resp.data.data.map((d: any) => ({
          label: d.nombre,
          value: d.id_departamento
        }))
      }
    },

    async fetchBeneficiarioCatalogs() {
      if (this.parentescos.length > 0 && this.expedidos.length > 0) return
      const resp = await api.get('/v1/beneficios/catalogs')
      if (resp.data.success) {
        this.parentescos = (resp.data.data.parentescos || []).map((p: any) => ({
          label: p.nombre,
          value: p.id_parentesco
        }))

        this.expedidos = (resp.data.data.expedidos || []).map((d: any) => ({
          label: d.nombre,
          value: d.id_departamento
        }))
      }
    },

    async fetchDepartamentos(paisId: number) {
      this.departamentos = []
      this.ciudades = []
      const resp = await api.get(`/v1/geo/paises/${paisId}/departamentos`)
      if (resp.data.success) {
        this.departamentos = resp.data.data.map((d: any) => ({
          label: d.nombre,
          value: d.id_departamento,
          code: d.codigo_expedido
        }))
      }
    },

    async fetchCiudades(departamentoId: number) {
      this.ciudades = []
      const resp = await api.get(`/v1/geo/departamentos/${departamentoId}/ciudades`)
      if (resp.data.success) {
        this.ciudades = resp.data.data.map((c: any) => ({ label: c.nombre, value: c.id_ciudad }))
      }
    },

    async searchCiudades(query: string) {
      const resp = await api.get(`/v1/geo/ciudades?search=${query}`)
      if (resp.data.success) {
        return resp.data.data.map((c: any) => ({
          label: `${c.nombre} (${c.departamento?.nombre || ''})`,
          value: c.id_ciudad
        }))
      }
      return []
    },

    async fetchCajas() {
      if (this.cajas.length > 0) return
      const resp = await api.get('/v1/talento-humano/catalogs')
      if (resp.data.success) {
        this.cajas = resp.data.data.caja_salud.map((c: any) => ({ label: c.nombre, value: c.id_caja }))
        this.pensiones = resp.data.data.entidad_pensiones.map((p: any) => ({ label: p.nombre, value: p.id_entidad_pensiones }))
      }
    }
  }
})
