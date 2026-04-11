import { defineStore } from 'pinia'
import reportesService, {
  type ReporteFormat,
  type ReporteSection,
  type ReportesFilters,
} from 'src/modules/reportes/services/reportes.service'
import { useNotify } from 'src/shared/composables/useNotify'

export const useReportesStore = defineStore('reportes', {
  state: () => ({
    loading: false,
    exporting: false,
    dashboard: null as any,
    filters: {
      mes: new Date().getMonth() + 1,
      id_sede: null,
      id_area: null,
    } as ReportesFilters,
  }),

  actions: {
    async fetchDashboard(overrides: ReportesFilters = {}) {
      const { error } = useNotify()
      this.loading = true

      try {
        this.filters = {
          ...this.filters,
          ...overrides,
        }

        this.dashboard = await reportesService.getDashboard(this.filters)
      } catch (err: any) {
        error(err.response?.data?.message || 'No se pudieron cargar los reportes')
      } finally {
        this.loading = false
      }
    },

    async exportReport(section: ReporteSection, format: ReporteFormat) {
      const { error } = useNotify()
      this.exporting = true

      try {
        return await reportesService.exportReport(section, format, this.filters)
      } catch (err: any) {
        error(err.response?.data?.message || 'No se pudo exportar el reporte')
        throw err
      } finally {
        this.exporting = false
      }
    },
  },
})
