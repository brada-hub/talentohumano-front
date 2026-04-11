import { defineStore } from 'pinia';
import api from 'src/shared/api/axios.instance';

export const useSsoStore = defineStore('sso', {
  state: () => ({
    systems: [] as any[],
    roles: [] as any[],
    permissions: [] as any[],
    users: [] as any[],
    personasWithoutUser: [] as any[],
    loading: false,
  }),

  actions: {
    // --- Systems ---
    async fetchSystems() {
      this.loading = true;
      try {
        const response = await api.get('/v1/auth/sso/systems');
        this.systems = response.data.data;
      } finally {
        this.loading = false;
      }
    },

    async saveSystem(system: any) {
      if (system.id_sistema) {
        await api.put(`/v1/auth/sso/systems/${system.id_sistema}`, system);
      } else {
        await api.post('/v1/auth/sso/systems', system);
      }
      await this.fetchSystems();
    },

    async removeSystem(id: number) {
      await api.delete(`/v1/auth/sso/systems/${id}`);
      await this.fetchSystems();
    },

    // --- Roles ---
    async fetchRoles(sistemaId?: number) {
      this.loading = true;
      try {
        const params = sistemaId ? { sistema_id: sistemaId } : {};
        const response = await api.get('/v1/auth/sso/roles', { params });
        this.roles = response.data.data;
      } finally {
        this.loading = false;
      }
    },

    async saveRole(role: any) {
      if (role.id_rol) {
        await api.put(`/v1/auth/sso/roles/${role.id_rol}`, role);
      } else {
        await api.post('/v1/auth/sso/roles', role);
      }
      await this.fetchRoles();
    },

    // --- Permissions ---
    async fetchPermissions(sistemaId?: number) {
      const params = sistemaId ? { sistema_id: sistemaId } : {};
      const response = await api.get('/v1/auth/sso/permissions', { params });
      this.permissions = response.data.data;
    },

    async savePermission(permission: any) {
      await api.post('/v1/auth/sso/permissions', permission);
      await this.fetchPermissions(permission.sistema_id);
    },

    // --- Users ---
    async fetchUsers() {
      this.loading = true;
      try {
        const response = await api.get('/v1/auth/sso/users');
        this.users = response.data.data;
      } finally {
        this.loading = false;
      }
    },

    async updateAccess(userId: number, accessData: any) {
      await api.post(`/v1/auth/sso/users/${userId}/access`, accessData);
      await this.fetchUsers();
    },

    async toggleUserStatus(userId: number) {
      await api.post(`/v1/auth/sso/users/${userId}/toggle-status`);
      await this.fetchUsers();
    },

    async resetUserPassword(userId: number) {
      await api.post(`/v1/auth/sso/users/${userId}/reset-password`);
    },

    async fetchPersonasWithoutUser() {
      const response = await api.get('/v1/auth/sso/personas-sin-usuario');
      this.personasWithoutUser = response.data.data;
    },

    async createUser(userData: any) {
      await api.post('/v1/auth/sso/users', userData);
      await this.fetchUsers();
    }
  }
});
