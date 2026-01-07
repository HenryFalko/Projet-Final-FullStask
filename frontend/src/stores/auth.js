import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('auth_token') || null,
        loading: false,
        error: null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === 'admin',
    },

    actions: {
        async register(name, email, password, password_confirmation) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.post('/register', {
                    name,
                    email,
                    password,
                    password_confirmation,
                });

                this.token = response.data.access_token;
                this.user = response.data.user;

                localStorage.setItem('auth_token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));

                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Registration failed';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async login(email, password) {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.post('/login', { email, password });

                this.token = response.data.access_token;
                this.user = response.data.user;

                localStorage.setItem('auth_token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));

                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Login failed';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async logout() {
            try {
                await api.post('/logout');
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                this.token = null;
                this.user = null;
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
            }
        },

        async fetchUser() {
            try {
                const response = await api.get('/user');
                this.user = response.data.user;
                localStorage.setItem('user', JSON.stringify(this.user));
            } catch (error) {
                console.error('Fetch user error:', error);
            }
        },
    },
});
