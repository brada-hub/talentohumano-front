import api from 'src/shared/api/axios.instance';
import { CreatePersonaData, PersonaResponse, SinglePersonaResponse } from '../types/persona.types';

export const personaService = {
  async getAll(page = 1, perPage = 15): Promise<PersonaResponse> {
    const { data } = await api.get('/v1/personal/personas', {
      params: { page, per_page: perPage },
    });
    return data;
  },

  async getById(id: string): Promise<SinglePersonaResponse> {
    const { data } = await api.get(`/v1/personal/personas/${id}`);
    return data;
  },

  async create(payload: CreatePersonaData): Promise<{ success: boolean; data: { id: string } }> {
    const { data } = await api.post('/v1/personal/personas', payload);
    return data;
  },
};
