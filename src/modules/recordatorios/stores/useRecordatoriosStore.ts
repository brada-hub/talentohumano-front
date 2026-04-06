import { defineStore } from 'pinia'
import recordatoriosService from '../services/recordatorios.service'

export const useRecordatoriosStore = defineStore('recordatorios', {
  state: () => ({
    loading: false,
    sending: false,
    filtros: {
      mes: new Date().getMonth() + 1,
      id_sede: null as number | null,
      id_area: null as number | null,
    },
    resumen: {
      filtros: {
        mes: new Date().getMonth() + 1,
        id_sede: null,
        id_area: null,
      },
      catalogos: {
        meses: [],
        sedes: [],
        areas: [],
      },
      cumpleanios: { hoy: [], semana: [], mes: [], proximos: [] },
      aniversarios: { hoy: [], mes: [], proximos: [] },
      contratos_por_vencer: { '7_dias': [], '30_dias': [], mes: [], proximos: [] },
      recordatorios_enviados: [],
    } as any,
  }),

  actions: {
    async fetchResumen() {
      this.loading = true
      try {
        this.resumen = await recordatoriosService.getResumen(this.filtros)
      } finally {
        this.loading = false
      }
    },

    async sendCumpleanios(empleadoId: number, force = false) {
      this.sending = true
      try {
        const response = await recordatoriosService.sendCumpleanios(empleadoId, false, force)
        await this.fetchResumen()
        return response
      } finally {
        this.sending = false
      }
    },

    setFiltro<K extends 'mes' | 'id_sede' | 'id_area'>(key: K, value: (typeof this.filtros)[K]) {
      this.filtros[key] = value
    },

    clearFiltros() {
      this.filtros = {
        mes: new Date().getMonth() + 1,
        id_sede: null,
        id_area: null,
      }
    },
  },
})
