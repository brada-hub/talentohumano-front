import { defineStore } from 'pinia';
import api from 'src/shared/api/axios.instance';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userPermissions: (state) => state.user?.permissions || [],
    userRoles: (state) => state.user?.roles || [],
  },

  actions: {
    async login(credentials: any) {
      this.loading = true;
      try {
        const response = await api.post('/v1/auth/login', credentials);
        const { token, user } = response.data.data;

        this.token = token;
        this.user = user;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

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
      } finally {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },

    async fetchMe() {
      try {
        const response = await api.get('/v1/auth/me');
        this.user = response.data.data;
        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (error) {
        console.error('Error fetching me:', error);
      }
    },

    can(permission: string): boolean {
      return this.userPermissions.includes(permission);
    },

    hasRole(role: string): boolean {
      return this.userRoles.some((r: any) => r.nombres === role);
    }
  },
});
