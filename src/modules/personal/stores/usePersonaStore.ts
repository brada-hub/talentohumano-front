import { defineStore } from 'pinia';
import { Persona } from '../types/persona.types';
import { personaService } from '../services/persona.service';

export const usePersonaStore = defineStore('persona', {
  state: () => ({
    personas: [] as Persona[],
    total: 0,
    page: 1,
    perPage: 15,
    loading: false,
    selectedPersona: null as Persona | null,
  }),

  actions: {
    async fetchPersonas(page?: number, perPage?: number) {
      this.loading = true;
      try {
        const response = await personaService.getAll(
          page || this.page,
          perPage || this.perPage
        );
        this.personas = response.data;
        this.total = response.total;
        this.page = response.page;
      } finally {
        this.loading = false;
      }
    },

    async fetchPersonaById(id: string) {
      this.loading = true;
      try {
        const response = await personaService.getById(id);
        this.selectedPersona = response.data;
        return response.data;
      } finally {
        this.loading = false;
      }
    },

    async registerPersona(payload: any) {
      this.loading = true;
      try {
        const response = await personaService.create(payload);
        return response.data;
      } finally {
        this.loading = false;
      }
    },
  },
});
