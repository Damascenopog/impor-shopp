import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: {
        name: 'Antonio Damasceno',
        email: 'cliente@imporshopp.com.br',
        phone: '(21) 97289-3879',
        cpf: '123.456.789-00',
        birthDate: '1995-05-15',
        gender: 'Masculino',
        addresses: [
          {
            id: 'addr-1',
            label: 'Casa',
            recipient: 'Antonio Damasceno',
            cep: '20040-002',
            street: 'Avenida Rio Branco',
            number: '156',
            complement: 'Sala 102',
            neighborhood: 'Centro',
            city: 'Rio de Janeiro',
            state: 'RJ',
            isDefault: true
          }
        ],
        orders: [
          {
            id: 'IMP-84920',
            date: '10/08/2026',
            total: 254.40,
            status: 'Entregue',
            trackingCode: 'BR987654321AA',
            paymentMethod: 'Pix',
            items: [
              {
                name: 'Caixa de Som Karaokê Altomex AM-870',
                qty: 1,
                price: 254.40,
                color: 'Preto',
                image: 'https://dcdn-us.mitiendanube.com/stores/004/623/973/products/imagem_2024-05-30_165035655-removebg-preview-43d93707e7b6d177bc17170986507797-1024-1024.png'
              }
            ]
          }
        ]
      },
      isAuthenticated: true,

      login: (email, password) => {
        const cleanEmail = email.trim().toLowerCase();
        const existingUser = get().user;
        const loggedUser = {
          name: existingUser?.name || cleanEmail.split('@')[0].toUpperCase(),
          email: cleanEmail,
          phone: existingUser?.phone || '(21) 97289-3879',
          cpf: existingUser?.cpf || '123.456.789-00',
          birthDate: existingUser?.birthDate || '1995-05-15',
          gender: existingUser?.gender || 'Não informado',
          addresses: existingUser?.addresses || [
            {
              id: 'addr-1',
              label: 'Principal',
              recipient: cleanEmail.split('@')[0],
              cep: '20040-002',
              street: 'Avenida Rio Branco',
              number: '156',
              complement: '',
              neighborhood: 'Centro',
              city: 'Rio de Janeiro',
              state: 'RJ',
              isDefault: true
            }
          ],
          orders: existingUser?.orders || []
        };
        set({ user: loggedUser, isAuthenticated: true });
        return { success: true };
      },

      register: (userData) => {
        const newUser = {
          name: userData.name,
          email: userData.email.trim().toLowerCase(),
          phone: userData.phone || '',
          cpf: userData.cpf || '',
          birthDate: '',
          gender: '',
          addresses: [],
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
      },

      addAddress: (addressData) => {
        const state = get();
        if (!state.user) return;
        const newId = `addr-${Date.now()}`;
        const isFirst = !state.user.addresses || state.user.addresses.length === 0;
        const newAddress = {
          ...addressData,
          id: newId,
          isDefault: addressData.isDefault || isFirst
        };

        let updatedAddresses = state.user.addresses ? [...state.user.addresses] : [];
        if (newAddress.isDefault) {
          updatedAddresses = updatedAddresses.map((a) => ({ ...a, isDefault: false }));
        }
        updatedAddresses.push(newAddress);

        set({
          user: {
            ...state.user,
            addresses: updatedAddresses
          }
        });
      },

      updateAddress: (id, addressData) => {
        const state = get();
        if (!state.user || !state.user.addresses) return;

        let updatedAddresses = state.user.addresses.map((a) => {
          if (a.id === id) {
            return { ...a, ...addressData };
          }
          if (addressData.isDefault) {
            return { ...a, isDefault: false };
          }
          return a;
        });

        set({
          user: {
            ...state.user,
            addresses: updatedAddresses
          }
        });
      },

      deleteAddress: (id) => {
        const state = get();
        if (!state.user || !state.user.addresses) return;

        const remaining = state.user.addresses.filter((a) => a.id !== id);
        if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
          remaining[0].isDefault = true;
        }

        set({
          user: {
            ...state.user,
            addresses: remaining
          }
        });
      },

      setDefaultAddress: (id) => {
        const state = get();
        if (!state.user || !state.user.addresses) return;

        const updated = state.user.addresses.map((a) => ({
          ...a,
          isDefault: a.id === id
        }));

        set({
          user: {
            ...state.user,
            addresses: updated
          }
        });
      },

      addOrder: (orderData) => {
        const state = get();
        if (!state.user) return;
        const newOrders = [orderData, ...(state.user.orders || [])];
        set({
          user: {
            ...state.user,
            orders: newOrders
          }
        });
      }
    }),
    {
      name: 'imporshopp-auth-storage'
    }
  )
);
