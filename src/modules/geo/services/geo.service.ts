import api from 'src/shared/api/axios.instance'

export interface Pais {
  id_pais: number
  nombre: string
  iso2: string
  iso3: string
  prefijo_telefonico: string | null
  activo: boolean
}

export interface Departamento {
  id_departamento: number
  nombre: string
  codigo_expedido: string
  pais_id: number
}

export interface Ciudad {
  id_ciudad: number
  nombre: string
  departamento_id: number
  departamento?: Departamento
}

export interface Nacionalidad {
  id_nacionalidad: number
  gentilicio: string
  id_pais: number
}

// Cache simple
let paisesCache: Pais[] | null = null
let nacionalidadesCache: Nacionalidad[] | null = null

export const geoService = {
  async getPaises(): Promise<Pais[]> {
    if (paisesCache) return paisesCache
    
    const response = await api.get('/v1/geo/paises')
    paisesCache = response.data.data
    return paisesCache!
  },

  async getDepartamentos(paisId: number): Promise<Departamento[]> {
    const response = await api.get(`/v1/geo/paises/${paisId}/departamentos`)
    return response.data.data
  },

  async getCiudades(departamentoId: number): Promise<Ciudad[]> {
    const response = await api.get(`/v1/geo/departamentos/${departamentoId}/ciudades`)
    return response.data.data
  },

  async searchCiudades(search: string): Promise<Ciudad[]> {
    if (search.length < 2) return []
    const response = await api.get('/v1/geo/ciudades', { params: { search } })
    return response.data.data
  },

  async getNacionalidades(): Promise<Nacionalidad[]> {
    if (nacionalidadesCache) return nacionalidadesCache
    
    const response = await api.get('/v1/geo/nacionalidades')
    nacionalidadesCache = response.data.data
    return nacionalidadesCache!
  },

  async getSedes(): Promise<any[]> {
    const response = await api.get('/v1/talento-humano/sedes')
    return response.data.data
  },

  async saveSede(sede: any): Promise<any> {
    if (sede.id_sede) {
      const response = await api.put(`/v1/talento-humano/sedes/${sede.id_sede}`, sede)
      return response.data.data
    }
    const response = await api.post('/v1/talento-humano/sedes', sede)
    return response.data.data
  },

  async deleteSede(id: number): Promise<void> {
    await api.delete(`/v1/talento-humano/sedes/${id}`)
  },

  async getCampus(): Promise<any[]> {
    const response = await api.get('/v1/talento-humano/campus')
    return response.data.data
  },

  async saveCampus(campus: any): Promise<any> {
    if (campus.id_campus) {
      const response = await api.put(`/v1/talento-humano/campus/${campus.id_campus}`, campus)
      return response.data.data
    }
    const response = await api.post('/v1/talento-humano/campus', campus)
    return response.data.data
  },

  async deleteCampus(id: number): Promise<void> {
    await api.delete(`/v1/talento-humano/campus/${id}`)
  },

  // Clear cache
  clearCache() {
    paisesCache = null
    nacionalidadesCache = null
  }
}

export default geoService
