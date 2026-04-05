import { api } from 'boot/axios'

const beneficiosService = {
  async getCatalogs() {
    const { data } = await api.get('/v1/beneficios/catalogs')
    return data.data
  },

  async getByEmpleado(empleadoId: number) {
    const { data } = await api.get(`/v1/beneficios/empleados/${empleadoId}/beneficiarios`)
    return data.data
  },

  async create(empleadoId: number, payload: Record<string, unknown>) {
    const { data } = await api.post(`/v1/beneficios/empleados/${empleadoId}/beneficiarios`, payload)
    return data.data
  },

  async update(id: number, payload: Record<string, unknown>) {
    const { data } = await api.put(`/v1/beneficios/beneficiarios/${id}`, payload)
    return data.data
  },

  async remove(id: number) {
    await api.delete(`/v1/beneficios/beneficiarios/${id}`)
  },
}

export default beneficiosService
