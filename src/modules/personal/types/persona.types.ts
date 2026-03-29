export interface Persona {
  id: string;
  primer_apellido: string;
  segundo_apellido: string | null;
  nombres: string;
  ci: string;
  complemento: string | null;
  id_ci_expedido: string;
  id_sexo: string;
  celular_personal: string;
  correo_personal: string;
  estado_civil: string;
  id_nacionalidad: string;
  direccion_domicilio: string | null;
  id_ciudad: string;
  id_pais: string;
  activo: boolean;
}

export interface CreatePersonaData {
  primerApellido: string;
  segundoApellido?: string | null;
  nombres: string;
  ci: string;
  complemento?: string | null;
  idCiExpedido: string;
  idSexo: string;
  celularPersonal: string;
  correoPersonal: string;
  estadoCivil: string;
  idNacionalidad: string;
  idCiudad: string;
  idPais: string;
  direccionDomicilio?: string | null;
}

export interface PersonaResponse {
  success: boolean;
  data: Persona[];
  total: number;
  page: number;
}

export interface SinglePersonaResponse {
  success: boolean;
  data: Persona;
}
