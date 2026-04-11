import { defineStore } from 'pinia'
import { ref } from 'vue'
import estructuraService from '../services/estructura.service'

export const useEstructuraStore = defineStore('estructura', () => {
  const loading = ref(false)
  const niveles = ref<any[]>([])
  const areas = ref<any[]>([])
  const cargos = ref<any[]>([])
  const grupos = ref<any[]>([])
  const puestos = ref<any[]>([])

  async function fetchAll() {
    loading.value = true
    try {
      const [nivelesData, areasData, cargosData, gruposData, puestosData] = await Promise.all([
        estructuraService.getNiveles(),
        estructuraService.getAreas(),
        estructuraService.getCargos(),
        estructuraService.getGruposPersonal(),
        estructuraService.getPuestos(),
      ])

      niveles.value = nivelesData
      areas.value = areasData
      cargos.value = cargosData
      grupos.value = gruposData
      puestos.value = puestosData
    } finally {
      loading.value = false
    }
  }

  async function saveNivel(payload: any) {
    loading.value = true
    try {
      await estructuraService.saveNivel(payload)
      await fetchAll()
    } finally {
      loading.value = false
    }
  }

  async function deleteNivel(id: number) {
    loading.value = true
    try {
      await estructuraService.deleteNivel(id)
      await fetchAll()
    } finally {
      loading.value = false
    }
  }

  async function saveArea(payload: any) {
    loading.value = true
    try {
      await estructuraService.saveArea(payload)
      await fetchAll()
    } finally {
      loading.value = false
    }
  }

  async function deleteArea(id: number) {
    loading.value = true
    try {
      await estructuraService.deleteArea(id)
      await fetchAll()
    } finally {
      loading.value = false
    }
  }

  async function saveCargo(payload: any) {
    loading.value = true
    try {
      await estructuraService.saveCargo(payload)
      await fetchAll()
    } finally {
      loading.value = false
    }
  }

  async function deleteCargo(id: number) {
    loading.value = true
    try {
      await estructuraService.deleteCargo(id)
      await fetchAll()
    } finally {
      loading.value = false
    }
  }

  async function saveGrupo(payload: any) {
    loading.value = true
    try {
      await estructuraService.saveGrupoPersonal(payload)
      await fetchAll()
    } finally {
      loading.value = false
    }
  }

  async function deleteGrupo(id: number) {
    loading.value = true
    try {
      await estructuraService.deleteGrupoPersonal(id)
      await fetchAll()
    } finally {
      loading.value = false
    }
  }

  async function savePuesto(payload: any) {
    loading.value = true
    try {
      await estructuraService.savePuesto(payload)
      await fetchAll()
    } finally {
      loading.value = false
    }
  }

  async function deletePuesto(id: number) {
    loading.value = true
    try {
      await estructuraService.deletePuesto(id)
      await fetchAll()
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    niveles,
    areas,
    cargos,
    grupos,
    puestos,
    fetchAll,
    saveNivel,
    deleteNivel,
    saveArea,
    deleteArea,
    saveCargo,
    deleteCargo,
    saveGrupo,
    deleteGrupo,
    savePuesto,
    deletePuesto,
  }
})
