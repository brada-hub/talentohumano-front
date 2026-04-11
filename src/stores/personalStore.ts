import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import academicoService from 'src/modules/academico/services/academico.service'
import beneficiosService from 'src/modules/beneficios/services/beneficios.service'
import type { AcademicExperienceType, AcademicOtherType, AcademicRecordType } from 'src/modules/academico/types/academico.types'
import { useNotify } from 'shared/composables/useNotify'

export interface CatalogState {
  caja_salud: any[]
  entidad_pensiones: any[]
  tipo_contrato: any[]
  cargos: any[]
  areas: any[]
  sedes: any[]
  sexos: any[]
  departamentos: any[]
  nacionalidades: any[]
  ciudades: any[]
  paises: any[]
}

export const usePersonalStore = defineStore('personal', {
  state: () => ({
    employees: [] as any[],
    loading: false,
    saving: false,
    catalogs: {
      caja_salud: [],
      entidad_pensiones: [],
      tipo_contrato: [],
      cargos: [],
      areas: [],
      sedes: [],
      sexos: [],
      departamentos: [],
      nacionalidades: [],
      ciudades: [],
      paises: [],
    } as CatalogState,
    stats: null as any,
  }),

  actions: {
    async fetchStats() {
      try {
        const response = await api.get('/v1/talento-humano/stats')
        if (response.data.success) {
          this.stats = response.data.data
        }
      } catch (err) {
        console.error('Error fetching stats', err)
      }
    },
    async fetchEmployees() {
      const { error } = useNotify()
      this.loading = true
      try {
        const response = await api.get('/v1/talento-humano/empleados')
        if (response.data.success) {
          this.employees = response.data.data
        }
      } catch {
        error('Error al cargar la lista de empleados')
      } finally {
        this.loading = false
      }
    },

    async fetchCatalogs() {
      try {
        const response = await api.get('/v1/talento-humano/catalogs')
        if (response.data.success) {
          this.catalogs = response.data.data
        }
      } catch (err: any) {
        console.error('Error fetching catalogs', err)
      }
    },

    async createEmployee(data: any) {
      const { success, error } = useNotify()
      this.saving = true
      try {
        const response = await api.post('/v1/talento-humano/empleados', data)
        if (response.data.success) {
          success('Empleado registrado exitosamente')
          await Promise.all([this.fetchEmployees(), this.fetchStats()])
          return true
        }
        return false
      } catch (err: any) {
        let msg = err.response?.data?.message || 'Error al registrar empleado'
        if (err.response?.data?.errors) {
          const det = Object.values(err.response.data.errors).flat().join(', ')
          msg += ': ' + det
          console.error('Validation errors:', err.response.data.errors)
        }
        error(msg)
        return false
      } finally {
        this.saving = false
      }
    },

    async fetchEmployeeById(id: string | number) {
      try {
        const response = await api.get(`/v1/talento-humano/empleados/${id}`)
        if (response.data.success) {
          return response.data.data
        }
      } catch {
        return null
      }
    },

    async fetchAcademicProfile(personaId: string) {
      try {
        return await academicoService.getProfile(personaId)
      } catch (err) {
        console.error('Error fetching academic profile', err)
      }
      return null
    },

    async createAcademicRecord(personaId: string, type: AcademicRecordType, payload: FormData) {
      const { success, error } = useNotify()
      try {
        const data = await academicoService.createRecord(personaId, type, payload)
        success('Registro academico creado correctamente')
        return data
      } catch (err: any) {
        error(err.response?.data?.message || 'No se pudo crear el registro academico')
      }
      return null
    },

    async updateAcademicRecord(type: AcademicRecordType, id: number, payload: FormData) {
      const { success, error } = useNotify()
      try {
        const data = await academicoService.updateRecord(type, id, payload)
        success('Registro academico actualizado correctamente')
        return data
      } catch (err: any) {
        error(err.response?.data?.message || 'No se pudo actualizar el registro academico')
      }
      return null
    },

    async deleteAcademicRecord(type: AcademicRecordType, id: number) {
      const { success, error } = useNotify()
      try {
        await academicoService.deleteRecord(type, id)
        success('Registro academico eliminado')
        return true
      } catch (err: any) {
        error(err.response?.data?.message || 'No se pudo eliminar el registro academico')
      }
      return false
    },

    async createAcademicExperience(personaId: string, type: AcademicExperienceType, payload: FormData) {
      const { success, error } = useNotify()
      try {
        const data = await academicoService.createExperience(personaId, type, payload)
        success('Registro de experiencia creado correctamente')
        return data
      } catch (err: any) {
        error(err.response?.data?.message || 'No se pudo crear el registro de experiencia')
      }
      return null
    },

    async updateAcademicExperience(type: AcademicExperienceType, id: number, payload: FormData) {
      const { success, error } = useNotify()
      try {
        const data = await academicoService.updateExperience(type, id, payload)
        success('Registro de experiencia actualizado correctamente')
        return data
      } catch (err: any) {
        error(err.response?.data?.message || 'No se pudo actualizar el registro de experiencia')
      }
      return null
    },

    async deleteAcademicExperience(type: AcademicExperienceType, id: number) {
      const { success, error } = useNotify()
      try {
        await academicoService.deleteExperience(type, id)
        success('Registro de experiencia eliminado')
        return true
      } catch (err: any) {
        error(err.response?.data?.message || 'No se pudo eliminar el registro de experiencia')
      }
      return false
    },

    async createAcademicOther(personaId: string, type: AcademicOtherType, payload: FormData) {
      const { success, error } = useNotify()
      try {
        const data = await academicoService.createOther(personaId, type, payload)
        success('Registro academico creado correctamente')
        return data
      } catch (err: any) {
        error(err.response?.data?.message || 'No se pudo crear el registro')
      }
      return null
    },

    async updateAcademicOther(type: AcademicOtherType, id: number, payload: FormData) {
      const { success, error } = useNotify()
      try {
        const data = await academicoService.updateOther(type, id, payload)
        success('Registro academico actualizado correctamente')
        return data
      } catch (err: any) {
        error(err.response?.data?.message || 'No se pudo actualizar el registro')
      }
      return null
    },

    async deleteAcademicOther(type: AcademicOtherType, id: number) {
      const { success, error } = useNotify()
      try {
        await academicoService.deleteOther(type, id)
        success('Registro academico eliminado')
        return true
      } catch (err: any) {
        error(err.response?.data?.message || 'No se pudo eliminar el registro')
      }
      return false
    },

    async buscarPersonaPorCI(ci: string) {
      const { success, error } = useNotify()
      try {
        const response = await api.get(`/v1/talento-humano/empleados/buscar?ci=${ci}`)
        if (response.data.success) {
          success('Datos de Onboarding encontrados')
          return response.data.data
        }
      } catch (err: any) {
        if (err.response?.status !== 404) {
          error(err.response?.data?.message || 'Error al buscar persona')
        }
        return null
      }
    },

    // ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ Legajo Digital (Movido aquÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â­ por organizaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n) ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚ÂÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬
    async getLegajo(idEmpleado: number) {
      try {
        const response = await api.get(`/v1/talento-humano/empleados/${idEmpleado}/legajos`)
        return response.data.data
      } catch (err) {
        console.error('Error fetching legajo', err)
        return {
          documentos: [],
          resumen: {
            total_documentos: 0,
            generated_signed_count: 0,
            categorias_activas: 0,
            required_total: 0,
            required_completed: 0,
            required_missing: 0,
            coverage_percentage: 0,
            status: 'Crítico',
          },
          categorias: [],
        }
      }
    },

    async uploadDocument(idEmpleado: number, file: File, categoria: string) {
      const { success, error } = useNotify()
      const formData = new FormData()
      formData.append('file', file)
      formData.append('categoria', categoria)

      try {
        const response = await api.post(
          `/v1/talento-humano/empleados/${idEmpleado}/legajos`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        )
        if (response.data.success) {
          success('Documento subido correctamente')
          return response.data.data
        }
      } catch {
        error('No se pudo subir el archivo')
        return null
      }
    },

    async deleteDocument(idDocumento: number) {
      const { success, error } = useNotify()
      try {
        await api.delete(`/v1/talento-humano/legajos/${idDocumento}`)
        success('Documento eliminado')
        return true
      } catch {
        error('No se pudo eliminar el documento')
        return false
      }
    },

    async updateEmployee(id: number, data: any) {
      const { success, error } = useNotify()
      try {
        const response = await api.put(`/v1/talento-humano/empleados/${id}`, data)
        if (response.data.success) {
          success('InformaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n actualizada correctamente')
          return response.data.data
        }
        return null
      } catch (err: any) {
        error(err.response?.data?.message || 'Error al actualizar informaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n')
        return null
      }
    },

    async fetchBeneficiosCatalogs() {
      try {
        return await beneficiosService.getCatalogs()
      } catch (err) {
        console.error('Error fetching beneficios catalogs', err)
        return null
      }
    },

    async fetchBeneficiarios(empleadoId: number) {
      try {
        return await beneficiosService.getByEmpleado(empleadoId)
      } catch (err) {
        console.error('Error fetching beneficiarios', err)
        return []
      }
    },

    async createBeneficiario(empleadoId: number, payload: any) {
      const { success, error } = useNotify()
      try {
        const data = await beneficiosService.create(empleadoId, payload)
        success('Beneficiario registrado correctamente')
        return data
      } catch (err: any) {
        error(err.response?.data?.message || 'No se pudo registrar el beneficiario')
        return null
      }
    },

    async updateBeneficiario(id: number, payload: any) {
      const { success, error } = useNotify()
      try {
        const data = await beneficiosService.update(id, payload)
        success('Beneficiario actualizado correctamente')
        return data
      } catch (err: any) {
        error(err.response?.data?.message || 'No se pudo actualizar el beneficiario')
        return null
      }
    },

    async deleteBeneficiario(id: number) {
      const { success, error } = useNotify()
      try {
        await beneficiosService.remove(id)
        success('Beneficiario eliminado correctamente')
        return true
      } catch (err: any) {
        error(err.response?.data?.message || 'No se pudo eliminar el beneficiario')
        return false
      }
    }
  }
})
