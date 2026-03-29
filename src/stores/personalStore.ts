import { defineStore } from 'pinia'
import { api } from 'boot/axios'
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
    }
  }
})
