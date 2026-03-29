import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'
import api from 'src/shared/api/axios.instance'

export const useOnboardingStore = defineStore('onboarding', {
  state: () => ({
    sessionKey: LocalStorage.getItem('onboarding_session_key') || '',
    persona: LocalStorage.getItem('onboarding_persona') || { id_pais: 2, id_sexo: 1, id_expedido: null } as any,
    academico: LocalStorage.getItem('onboarding_academico') || [] as any[],
    experiencia: LocalStorage.getItem('onboarding_experiencia') || [] as any[],
    otros: LocalStorage.getItem('onboarding_otros') || [] as any[],
    archivos: { ci_escaneado: null } as any, // Los archivos NUNCA se recuperan de LocalStorage por estabilidad
    loading: false,
    // Catálogos
    paises: [] as any[],
    nacionalidades: [] as any[],
    expedidos: [] as any[], // Siempre de Bolivia
    departamentos: [] as any[],
    ciudades: [] as any[]
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
      // Guardamos todo MENOS los objetos File reales que rompen Quasar al recargar o causan warnings de serialización
      LocalStorage.set('onboarding_persona', this.persona)
      LocalStorage.set('onboarding_academico', this.academico.map(i => ({ ...i, archivo_respaldo: null, archivo_diploma: null, archivo_titulo: null })))
      LocalStorage.set('onboarding_experiencia', this.experiencia.map(i => ({ ...i, archivo_respaldo: null })))
      LocalStorage.set('onboarding_otros', this.otros.map(i => ({ ...i, archivo_respaldo: null })))
      // Los archivos de la Sección 5 tampoco se guardan localmente por seguridad y estabilidad
    },

    async verificarIdentidad(payload: any) {
      this.loading = true
      try {
        const resp = await api.post('/portal/verificar', payload)
        if (resp.data.success) {
          const result = resp.data.data
          // Store session key
          this.sessionKey = result.session_key || ''
          LocalStorage.set('onboarding_session_key', this.sessionKey)
          
          // Preload persona data if exists
          const pre = result.datos_precargados
          if (pre) {
            // ═══ Transformar datos de Eloquent a formato del formulario ═══
            
            // Extraer el código de expedido de la relación (ej: {codigo_expedido: 'CB'} → 'CB')
            const expedidoCode = pre.expedido?.codigo_expedido || pre.id_expedido || 'CB'

            // Extraer nacionalidad como string (ej: {gentilicio: 'Boliviana'} → 'Boliviana')
            let nacionalidadStr = ''
            if (typeof pre.nacionalidad === 'object' && pre.nacionalidad !== null) {
              nacionalidadStr = pre.nacionalidad.gentilicio || pre.nacionalidad.nombre || ''
            } else if (typeof pre.nacionalidad === 'string') {
              nacionalidadStr = pre.nacionalidad
            }

            // Extraer ciudad como string (ej: {nombre: 'Cochabamba'} → 'Cochabamba')
            let ciudadStr = ''
            if (typeof pre.ciudad === 'object' && pre.ciudad !== null) {
              ciudadStr = pre.ciudad.nombre || ''
            } else if (typeof pre.id_ciudad === 'string') {
              ciudadStr = pre.id_ciudad
            } else if (typeof pre.id_ciudad === 'number') {
              // Fallback: convertir ID a nombre si posible
              const ciudades: Record<number, string> = {
                1: 'Cochabamba', 2: 'La Paz', 3: 'Santa Cruz', 4: 'Oruro',
                5: 'Potosí', 6: 'Chuquisaca', 7: 'Tarija', 8: 'Beni', 9: 'Pando'
              }
              ciudadStr = ciudades[pre.id_ciudad] || ''
            }

            // Formatear fecha para el input type="date" (YYYY-MM-DD)
            let fechaNac = pre.fecha_nacimiento || payload.fecha_nacimiento || ''
            if (fechaNac && fechaNac.includes('T')) {
              fechaNac = fechaNac.split('T')[0]
            }

            // ═══ Asignar datos transformados ═══
            this.persona = {
              ...pre,
              id_expedido: expedidoCode,
              nacionalidad: nacionalidadStr,
              id_ciudad: ciudadStr,
              fecha_nacimiento: fechaNac,
              id_sexo: pre.id_sexo || 1,
              id_pais: pre.id_pais || 1,
            }

            // Remover objetos de relaciones que no son campos del form
            delete this.persona.sexo
            delete this.persona.ciudad
            delete this.persona.pais
            delete this.persona.expedido
            delete this.persona.formacion_pregrado
            delete this.persona.formacion_postgrado
            delete this.persona.experiencia_docente
            delete this.persona.experiencia_profesional
            delete this.persona.capacitaciones
            delete this.persona.idiomas
            delete this.persona.produccion_intelectual
            delete this.persona.reconocimientos

            // Cargar secciones académicas/experiencia/otros
            this.academico = [
              ...(pre.formacion_pregrado || []).map((i: any) => ({ ...i, tipo_registro: 'pregrado' })),
              ...(pre.formacion_postgrado || []).map((i: any) => ({ ...i, tipo_registro: 'postgrado' }))
            ]
            this.experiencia = [
              ...(pre.experiencia_docente || []).map((i: any) => ({ ...i, tipo_registro: 'docente' })),
              ...(pre.experiencia_profesional || []).map((i: any) => ({ ...i, tipo_registro: 'profesional' }))
            ]
            this.otros = [
              ...(pre.capacitaciones || []).map((i: any) => ({ ...i, tipo_registro: 'capacitacion' })),
              ...(pre.idiomas || []).map((i: any) => ({ ...i, tipo_registro: 'idioma' })),
              ...(pre.produccion_intelectual || []).map((i: any) => ({ ...i, tipo_registro: 'produccion' })),
              ...(pre.reconocimientos || []).map((i: any) => ({ ...i, tipo_registro: 'reconocimiento' }))
            ]

            // ═══ Pre-cargar Documentos y Fotos guardadas ═══
            if (pre.documentos && Array.isArray(pre.documentos)) {
              // Recuperar foto local si no tenía en el objeto principal
              const ciDoc = pre.documentos.find((d: any) => d.tipo === 'ci' || d.tipo === 'ci_escaneado')

              // Helper para convertir URL a objeto File para Q-File
              const urlToFile = async (url: string, filename: string, mimeType: string) => {
                try {
                  const fullUrl = url.startsWith('http') ? url : `http://localhost:8000${url}`
                  const res = await fetch(fullUrl)
                  const buf = await res.arrayBuffer()
                  return new File([buf], filename, { type: mimeType })
                } catch { return null }
              }

              if (pre.foto && !pre.foto.startsWith('data:')) {
                try {
                  // Cargar URL como Base64 para el preview en frontend
                  const fullUrl = pre.foto.startsWith('http') ? pre.foto : `http://localhost:8000${pre.foto}`
                  const res = await fetch(fullUrl)
                  const buf = await res.arrayBuffer()
                  const ext = pre.foto.split('.').pop() || 'png'
                  const base64String = btoa(new Uint8Array(buf).reduce((data, byte) => data + String.fromCharCode(byte), ''))
                  this.persona.foto = `data:image/${ext};base64,${base64String}`
                } catch (e) { console.error('Error pre-loading foto from persona', e) }
              }
              
              if (ciDoc) {
                const mime = ciDoc.formato === 'pdf' ? 'application/pdf' : `image/${ciDoc.formato}`
                urlToFile(ciDoc.ruta_archivo, ciDoc.nombre_archivo, mime).then(file => {
                  if (file) this.archivos.ci_escaneado = file
                })
              }
            }
          } else {
            // New user: just set CI and birth date
            this.persona.ci = payload.ci
            this.persona.fecha_nacimiento = payload.fecha_nacimiento
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
      // Función auxiliar para convertir File a Base64
      const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });

      // Procesar archivo de CI (si es un File nuevo)
      let ciEscaneadoB64 = this.archivos.ci_escaneado;
      if (ciEscaneadoB64 instanceof File) {
        ciEscaneadoB64 = await fileToBase64(ciEscaneadoB64);
      }

      // Procesar archivos dentro de arrays (academico, experiencia, otros)
      const processArrayFiles = async (arr: any[]) => {
        return Promise.all(arr.map(async (item) => {
          const newItem = { ...item };
          if (newItem.archivo_respaldo instanceof File) newItem.archivo_respaldo = await fileToBase64(newItem.archivo_respaldo);
          if (newItem.archivo_diploma instanceof File) newItem.archivo_diploma = await fileToBase64(newItem.archivo_diploma);
          if (newItem.archivo_titulo instanceof File) newItem.archivo_titulo = await fileToBase64(newItem.archivo_titulo);
          return newItem;
        }));
      };

      const payload = {
        persona: this.persona,
        academico: await processArrayFiles(this.academico),
        experiencia: await processArrayFiles(this.experiencia),
        otros: await processArrayFiles(this.otros),
        archivos: { ci_escaneado: ciEscaneadoB64 }
      }

      const resp = await api.post('/portal/completar', payload)
      if (resp.data.success) {
        this.clearStore()
      }
      return resp.data
    },

    clearStore() {
      this.persona = { id_pais: 1, id_sexo: 1, id_expedido: 'CB' }
      this.academico = []
      this.experiencia = []
      this.otros = []
      this.archivos = { ci_escaneado: null }
      LocalStorage.clear()
    },

    // --- ACCIONES DE CATÁLOGOS GEO ---
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
      // Bolivia ID = 2 (verificado en la DB actual para Bolivia)
      const resp = await api.get('/v1/geo/paises/2/departamentos')
      if (resp.data.success) {
        this.expedidos = resp.data.data.map((d: any) => ({ 
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
    }
  }
})
