import { api } from 'boot/axios'

const recordatoriosService = {
  async getResumen(params: Record<string, unknown> = {}) {
    const { data } = await api.get('/v1/recordatorios/resumen', { params })
    return data.data
  },

  async sendCumpleanios(empleadoId: number, automatico = false, force = false) {
    const { data } = await api.post(`/v1/recordatorios/cumpleanios/${empleadoId}/enviar`, {
      automatico,
      force,
    })

    return data.data
  },
}

export default recordatoriosService
