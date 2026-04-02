import { defineStore } from 'pinia'
import { ref } from 'vue'
import geoService, { type Pais, type Departamento, type Ciudad, type Nacionalidad } from '../services/geo.service'

export const useGeoStore = defineStore('geo', () => {
  // State
  const paises = ref<Pais[]>([])
  const departamentos = ref<Departamento[]>([])
  const ciudades = ref<Ciudad[]>([])
  const nacionalidades = ref<Nacionalidad[]>([])
  const sedes = ref<any[]>([])
  
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetchSedes() {
    loading.value = true
    try {
      // In this system sedes are in the talento-humano catalogs normally, 
      // but let's assume we can fetch them via a dedicated geo-like endpoint 
      // or just pull from the global catalogs if available.
      // For now, let's pull from the existing API.
      const response = await geoService.getSedes()
      sedes.value = response
      return sedes.value
    } catch (e: any) {
      error.value = e.message || 'Error al cargar sedes'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Actions
  async function fetchPaises() {
    if (paises.value.length > 0) return paises.value
    
    loading.value = true
    try {
      paises.value = await geoService.getPaises()
      return paises.value
    } catch (e: any) {
      error.value = e.message || 'Error al cargar países'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchDepartamentos(paisId: number) {
    loading.value = true
    try {
      departamentos.value = await geoService.getDepartamentos(paisId)
      return departamentos.value
    } catch (e: any) {
      error.value = e.message || 'Error al cargar departamentos'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchCiudades(departamentoId: number) {
    loading.value = true
    try {
      ciudades.value = await geoService.getCiudades(departamentoId)
      return ciudades.value
    } catch (e: any) {
      error.value = e.message || 'Error al cargar ciudades'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function searchCiudades(search: string) {
    if (search.length < 2) return []
    
    loading.value = true
    try {
      return await geoService.searchCiudades(search)
    } catch (e: any) {
      error.value = e.message || 'Error al buscar ciudades'
      return []
    } finally {
      loading.value = false
    }
  }

  async function fetchNacionalidades() {
    if (nacionalidades.value.length > 0) return nacionalidades.value
    
    loading.value = true
    try {
      nacionalidades.value = await geoService.getNacionalidades()
      return nacionalidades.value
    } catch (e: any) {
      error.value = e.message || 'Error al cargar nacionalidades'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Helpers
  function getPaisById(id: number): Pais | undefined {
    return paises.value.find(p => p.id_pais === id)
  }

  function getDepartamentoById(id: number): Departamento | undefined {
    return departamentos.value.find(d => d.id_departamento === id)
  }

  function getCiudadById(id: number): Ciudad | undefined {
    return ciudades.value.find(c => c.id_ciudad === id)
  }

  function clearCache() {
    paises.value = []
    departamentos.value = []
    ciudades.value = []
    nacionalidades.value = []
    geoService.clearCache()
  }

  return {
    // State
    paises,
    departamentos,
    ciudades,
    nacionalidades,
    sedes,
    loading,
    error,
    
    // Actions
    fetchSedes,
    fetchPaises,
    fetchDepartamentos,
    fetchCiudades,
    searchCiudades,
    fetchNacionalidades,
    
    // Helpers
    getPaisById,
    getDepartamentoById,
    getCiudadById,
    clearCache,
  }
})
