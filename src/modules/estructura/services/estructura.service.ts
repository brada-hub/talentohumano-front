import { api } from 'boot/axios'

export const estructuraService = {
  async getNiveles() {
    const response = await api.get('/v1/talento-humano/niveles-jerarquicos')
    return response.data.data
  },

  async saveNivel(payload: any) {
    if (payload.id_jerarquico) {
      const response = await api.put(`/v1/talento-humano/niveles-jerarquicos/${payload.id_jerarquico}`, payload)
      return response.data.data
    }

    const response = await api.post('/v1/talento-humano/niveles-jerarquicos', payload)
    return response.data.data
  },

  async deleteNivel(id: number) {
    await api.delete(`/v1/talento-humano/niveles-jerarquicos/${id}`)
  },

  async getAreas() {
    const response = await api.get('/v1/talento-humano/areas')
    return response.data.data
  },

  async saveArea(payload: any) {
    if (payload.id_area) {
      const response = await api.put(`/v1/talento-humano/areas/${payload.id_area}`, payload)
      return response.data.data
    }

    const response = await api.post('/v1/talento-humano/areas', payload)
    return response.data.data
  },

  async deleteArea(id: number) {
    await api.delete(`/v1/talento-humano/areas/${id}`)
  },

  async getCargos() {
    const response = await api.get('/v1/talento-humano/cargos')
    return response.data.data
  },

  async saveCargo(payload: any) {
    if (payload.id_cargo) {
      const response = await api.put(`/v1/talento-humano/cargos/${payload.id_cargo}`, payload)
      return response.data.data
    }

    const response = await api.post('/v1/talento-humano/cargos', payload)
    return response.data.data
  },

  async deleteCargo(id: number) {
    await api.delete(`/v1/talento-humano/cargos/${id}`)
  },

  async getGruposPersonal() {
    const response = await api.get('/v1/talento-humano/grupos-personal')
    return response.data.data
  },

  async saveGrupoPersonal(payload: any) {
    if (payload.id_grupo_personal) {
      const response = await api.put(`/v1/talento-humano/grupos-personal/${payload.id_grupo_personal}`, payload)
      return response.data.data
    }

    const response = await api.post('/v1/talento-humano/grupos-personal', payload)
    return response.data.data
  },

  async deleteGrupoPersonal(id: number) {
    await api.delete(`/v1/talento-humano/grupos-personal/${id}`)
  },

  async getPuestos() {
    const response = await api.get('/v1/talento-humano/puestos')
    return response.data.data
  },

  async savePuesto(payload: any) {
    if (payload.id_puesto) {
      const response = await api.put(`/v1/talento-humano/puestos/${payload.id_puesto}`, payload)
      return response.data.data
    }

    const response = await api.post('/v1/talento-humano/puestos', payload)
    return response.data.data
  },

  async deletePuesto(id: number) {
    await api.delete(`/v1/talento-humano/puestos/${id}`)
  },
}

export default estructuraService
