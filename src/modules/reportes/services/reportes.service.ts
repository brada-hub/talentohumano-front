import { api } from 'boot/axios'

export interface ReportesFilters {
  mes?: number | null
  id_sede?: number | null
  id_area?: number | null
}

export type ReporteSection =
  | 'sedes'
  | 'contratos'
  | 'beneficiarios'
  | 'academico'
  | 'legajo'
  | 'recordatorios'

export type ReporteFormat = 'excel' | 'word' | 'pdf'

const reportesService = {
  async getDashboard(filters: ReportesFilters = {}) {
    const response = await api.get('/v1/reportes/dashboard', {
      params: filters,
    })

    return response.data.data
  },

  async exportReport(section: ReporteSection, format: ReporteFormat, filters: ReportesFilters = {}) {
    const response = await api.get('/v1/reportes/exportar', {
      params: {
        ...filters,
        seccion: section,
        formato: format,
      },
      responseType: 'blob',
    })

    const disposition = response.headers['content-disposition'] as string | undefined
    const filenameMatch = disposition?.match(/filename="?([^"]+)"?$/i)

    return {
      blob: response.data as Blob,
      filename: filenameMatch?.[1] || `reporte_${section}.${format === 'excel' ? 'xls' : format === 'word' ? 'doc' : 'pdf'}`,
    }
  },
}

export default reportesService
