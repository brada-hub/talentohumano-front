export interface AcademicProfile {
  persona_id: string
  persona: {
    nombres: string
    primer_apellido: string | null
    segundo_apellido: string | null
    ci: string
  }
  formacion_pregrado: any[]
  formacion_postgrado: any[]
  experiencia_docente: any[]
  experiencia_profesional: any[]
  capacitaciones: any[]
  produccion_intelectual: any[]
  reconocimientos: any[]
  idiomas: any[]
}

export type AcademicRecordType = 'pregrado' | 'postgrado'
export type AcademicExperienceType = 'docente' | 'profesional'
export type AcademicOtherType =
  | 'capacitaciones'
  | 'idiomas'
  | 'produccion-intelectual'
  | 'reconocimientos'
