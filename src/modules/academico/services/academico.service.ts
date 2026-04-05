import api from 'src/shared/api/axios.instance'
import type {
  AcademicExperienceType,
  AcademicOtherType,
  AcademicProfile,
  AcademicRecordType,
} from '../types/academico.types'

const recordEndpoints: Record<AcademicRecordType, string> = {
  pregrado: 'formacion-pregrado',
  postgrado: 'formacion-postgrado',
}

const experienceEndpoints: Record<AcademicExperienceType, string> = {
  docente: 'experiencia-docente',
  profesional: 'experiencia-profesional',
}

export const academicoService = {
  async getProfile(personaId: string): Promise<AcademicProfile | null> {
    const response = await api.get(`/v1/academico/personas/${personaId}`)
    return response.data.success ? response.data.data : null
  },

  async createRecord(personaId: string, type: AcademicRecordType, payload: FormData) {
    const response = await api.post(`/v1/academico/personas/${personaId}/${recordEndpoints[type]}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.data
  },

  async updateRecord(type: AcademicRecordType, id: number, payload: FormData) {
    payload.append('_method', 'PUT')
    const response = await api.post(`/v1/academico/${recordEndpoints[type]}/${id}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.data
  },

  async deleteRecord(type: AcademicRecordType, id: number) {
    await api.delete(`/v1/academico/${recordEndpoints[type]}/${id}`)
  },

  async createExperience(personaId: string, type: AcademicExperienceType, payload: FormData) {
    const response = await api.post(`/v1/academico/personas/${personaId}/${experienceEndpoints[type]}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.data
  },

  async updateExperience(type: AcademicExperienceType, id: number, payload: FormData) {
    payload.append('_method', 'PUT')
    const response = await api.post(`/v1/academico/${experienceEndpoints[type]}/${id}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.data
  },

  async deleteExperience(type: AcademicExperienceType, id: number) {
    await api.delete(`/v1/academico/${experienceEndpoints[type]}/${id}`)
  },

  async createOther(personaId: string, type: AcademicOtherType, payload: FormData) {
    const response = await api.post(`/v1/academico/personas/${personaId}/${type}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.data
  },

  async updateOther(type: AcademicOtherType, id: number, payload: FormData) {
    payload.append('_method', 'PUT')
    const response = await api.post(`/v1/academico/${type}/${id}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data.data
  },

  async deleteOther(type: AcademicOtherType, id: number) {
    await api.delete(`/v1/academico/${type}/${id}`)
  },
}

export default academicoService
