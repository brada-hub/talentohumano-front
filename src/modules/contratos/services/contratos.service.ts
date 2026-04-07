import { api } from 'boot/axios'

interface ContratoPreviewPayload {
  id_contrato?: number | null
  overrides?: Record<string, unknown>
}

export const contratosService = {
  async previewPlazoFijo(empleadoId: number, payload: ContratoPreviewPayload) {
    const response = await api.post(
      `/v1/talento-humano/empleados/${empleadoId}/contratos/plazo-fijo/preview`,
      payload,
    )

    return response.data.data
  },

  async descargarPlazoFijo(empleadoId: number, payload: ContratoPreviewPayload) {
    return api.post(
      `/v1/talento-humano/empleados/${empleadoId}/contratos/plazo-fijo/descargar`,
      payload,
      { responseType: 'blob' },
    )
  },
}

export default contratosService
