import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (email, password) => {
        // Mock authentication simulation
        const cleanEmail = email.trim().toLowerCase();
        const mockUser = {
          name: cleanEmail.split('@')[0].toUpperCase(),
          email: cleanEmail,
          phone: '(21) 99999-8888',
          orders: [
            {
              id: 'IMP-84920',
              date: '10/08/2026',
              total: 254.40,
              status: 'Entregue',
              items: ['Caixa de Som Karaokê Altomex AM-870']
            }
          ]
        };
        set({ user: mockUser, isAuthenticated: true });
        return { success: true };
      },

      register: (userData) => {
        const newUser = {
          name: userData.name,
          email: userData.email.trim().toLowerCase(),
          phone: userData.phone || '',
          orders: []
        };
        set({ user: newUser, isAuthenticated: true });
        return { success: true };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (updatedData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedData } : null
        }));
      }
    }),
    {
      name: 'imporshopp-auth-storage'
    }
  )
);
