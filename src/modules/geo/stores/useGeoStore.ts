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
  const campus = ref<any[]>([])
  
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetchSedes() {
    loading.value = true
    try {
      sedes.value = await geoService.getSedes()
      return sedes.value
    } catch (e: any) {
      error.value = e.message || 'Error al cargar sedes'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function saveSede(sede: any) {
    loading.value = true
    try {
      await geoService.saveSede(sede)
      await fetchSedes()
    } catch (e: any) {
      error.value = e.message || 'Error al guardar sede'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteSede(id: number) {
    loading.value = true
    try {
      await geoService.deleteSede(id)
      await fetchSedes()
    } catch (e: any) {
      error.value = e.message || 'Error al eliminar sede'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchCampus() {
    loading.value = true
    try {
      campus.value = await geoService.getCampus()
      return campus.value
    } catch (e: any) {
      error.value = e.message || 'Error al cargar campus'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function saveCampus(item: any) {
    loading.value = true
    try {
      await geoService.saveCampus(item)
      await fetchCampus()
    } catch (e: any) {
      error.value = e.message || 'Error al guardar campus'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteCampus(id: number) {
    loading.value = true
    try {
      await geoService.deleteCampus(id)
      await fetchCampus()
    } catch (e: any) {
      error.value = e.message || 'Error al eliminar campus'
      throw e
    } finally {
      loading.value = false
    }
  }

  // Actions Geo
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
    sedes.value = []
    campus.value = []
    geoService.clearCache()
  }

  return {
    paises, departamentos, ciudades, nacionalidades,
    sedes, campus, 
    loading, error,
    
    fetchSedes, saveSede, deleteSede,
    fetchCampus, saveCampus, deleteCampus,
    fetchPaises, fetchDepartamentos, fetchCiudades, searchCiudades, fetchNacionalidades,
    
    getPaisById, getDepartamentoById, getCiudadById, clearCache,
  }
})
