import { api } from 'boot/axios'

interface ContratoPreviewPayload {
  id_contrato?: number | null
  overrides?: Record<string, unknown>
}

export const contratosService = {
  async createContrato(empleadoId: number, payload: Record<string, unknown>) {
    const response = await api.post(
      `/v1/talento-humano/empleados/${empleadoId}/contratos`,
      payload,
    )

    return response.data.data
  },

  async updateContrato(empleadoId: number, contratoId: number, payload: Record<string, unknown>) {
    const response = await api.put(
      `/v1/talento-humano/empleados/${empleadoId}/contratos/${contratoId}`,
      payload,
    )

    return response.data.data
  },

  async finalizarContrato(empleadoId: number, contratoId: number, payload: { fecha_fin?: string | null } = {}) {
    const response = await api.patch(
      `/v1/talento-humano/empleados/${empleadoId}/contratos/${contratoId}/finalizar`,
      payload,
    )

    return response.data.data
  },

  async getVersiones(empleadoId: number, contratoId: number) {
    const response = await api.get(
      `/v1/talento-humano/empleados/${empleadoId}/contratos/${contratoId}/versiones`,
    )

    return response.data.data
  },

  async uploadFirmado(empleadoId: number, contratoId: number, file: File) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post(
      `/v1/talento-humano/empleados/${empleadoId}/contratos/${contratoId}/firmado`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )

    return response.data.data
  },

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

  async previewIndefinido(empleadoId: number, payload: ContratoPreviewPayload) {
    const response = await api.post(
      `/v1/talento-humano/empleados/${empleadoId}/contratos/indefinido/preview`,
      payload,
    )

    return response.data.data
  },

  async descargarIndefinido(empleadoId: number, payload: ContratoPreviewPayload) {
    return api.post(
      `/v1/talento-humano/empleados/${empleadoId}/contratos/indefinido/descargar`,
      payload,
      { responseType: 'blob' },
    )
  },
}

export default contratosService
