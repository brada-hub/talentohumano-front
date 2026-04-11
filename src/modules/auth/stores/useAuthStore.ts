import { defineStore } from 'pinia';
import api from 'src/shared/api/axios.instance';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('sigeth_user') || 'null'),
    token: localStorage.getItem('sigeth_token') || null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userPermissions: (state) => state.user?.permissions || [],
    userRoles: (state) => state.user?.roles || [],
    userFullName: (state) => {
      const p = state.user?.persona;
      if (!p) return state.user?.username || 'Usuario';
      return `${p.nombres} ${p.primer_apellido} ${p.segundo_apellido || ''}`.trim();
    },
    userCI: (state) => state.user?.persona?.ci || '',
    userSede: (state) => state.user?.sede?.nombre || 'General',
  },

  actions: {
    async login(credentials: any) {
      this.loading = true;
      try {
        const response = await api.post('/v1/auth/login', credentials);
        const { token, user } = response.data.data;

        this.token = token;
        this.user = user;

        localStorage.setItem('sigeth_token', token);
        localStorage.setItem('sigeth_user', JSON.stringify(user));

        return true;
      } catch (error: any) {
        throw error.response?.data?.message || 'Error en el inicio de sesión';
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      try {
        await api.post('/v1/auth/logout');
      } catch (error: any) {
        const status = error?.response?.status;
        if (status !== 401 && status !== 419) {
          throw error;
        }
      } finally {
        this.token = null;
        this.user = null;
        localStorage.removeItem('sigeth_token');
        localStorage.removeItem('sigeth_user');
      }
    },

    async fetchMe() {
      try {
        const response = await api.get('/v1/auth/me');
        this.user = response.data.data;
        localStorage.setItem('sigeth_user', JSON.stringify(this.user));
      } catch (error) {
        console.error('Error fetching me:', error);
      }
    },

    async changePassword(data: any) {
      this.loading = true;
      try {
        await api.post('/v1/auth/change-password', data);
        await this.fetchMe();
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(data: any) {
      this.loading = true;
      try {
        await api.post('/v1/auth/update-profile', data);
        await this.fetchMe();
      } finally {
        this.loading = false;
      }
    },

    can(permission: string): boolean {
      return this.userPermissions.includes(permission);
    },

    hasRole(role: string): boolean {
      return this.userRoles.some((r: any) => {
        if (typeof r === 'string') return r === role;
        return r.nombres === role;
      });
    }
  },
});
