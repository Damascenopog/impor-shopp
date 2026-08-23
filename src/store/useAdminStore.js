import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products as initialProducts } from '../data/products';

const INITIAL_ADMIN_ORDERS = [
  {
    id: 'IMP-948120',
    date: '23/08/2026 18:45',
    customerName: 'Antonio Damasceno',
    customerEmail: 'cliente@imporshopp.com.br',
    customerPhone: '(21) 97289-3879',
    shippingAddress: {
      cep: '20040-002',
      street: 'Avenida Rio Branco',
      number: '156',
      complement: 'Sala 102',
      neighborhood: 'Centro',
      city: 'Rio de Janeiro',
      state: 'RJ'
    },
    total: 254.40,
    status: 'Em separação',
    paymentMethod: 'PIX',
    trackingCode: 'BR987654321AA',
    items: [
      {
        name: 'Caixa de Som Karaokê sem fio Bluetooth LED RGB com Microfone 30W Altomex AM-870',
        qty: 1,
        price: 254.40,
        color: 'Preto',
        image: '//dcdn-us.mitiendanube.com/stores/004/623/973/products/1011270724g3872k5k8d-f00efac4feb50a4b5917375706614291-1024-1024.webp'
      }
    ]
  },
  {
    id: 'IMP-882319',
    date: '23/08/2026 14:20',
    customerName: 'Mariana Silva Souza',
    customerEmail: 'mariana.silva@gmail.com',
    customerPhone: '(21) 98877-6655',
    shippingAddress: {
      cep: '22041-001',
      street: 'Rua Barata Ribeiro',
      number: '450',
      complement: 'Apto 802',
      neighborhood: 'Copacabana',
      city: 'Rio de Janeiro',
      state: 'RJ'
    },
    total: 289.90,
    status: 'Pendente',
    paymentMethod: 'CARTÃO DE CRÉDITO',
    trackingCode: '',
    items: [
      {
        name: 'Smartwatch Ultra 2 49mm com Trava de Pulseiras e Parafusos Reais W99+ Microwear',
        qty: 1,
        price: 289.90,
        color: 'Laranja Titânio',
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1000&q=80'
      }
    ]
  },
  {
    id: 'IMP-749102',
    date: '22/08/2026 11:15',
    customerName: 'Lucas Ferreira Guimarães',
    customerEmail: 'lucas.ferreira@hotmail.com',
    customerPhone: '(21) 97766-5544',
    shippingAddress: {
      cep: '20511-170',
      street: 'Rua Conde de Bonfim',
      number: '300',
      complement: '',
      neighborhood: 'Tijuca',
      city: 'Rio de Janeiro',
      state: 'RJ'
    },
    total: 1499.00,
    status: 'Enviado',
    paymentMethod: 'PIX',
    trackingCode: 'BR123456789AA',
    items: [
      {
        name: 'Fone de Ouvido AirPods Pro 2ª Geração Original Apple MagSafe',
        qty: 1,
        price: 1499.00,
        color: 'Branco',
        image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1000&q=80'
      }
    ]
  },
  {
    id: 'IMP-612490',
    date: '20/08/2026 09:30',
    customerName: 'Carla Beatriz Ramos',
    customerEmail: 'carla.ramos@uol.com.br',
    customerPhone: '(21) 96655-4433',
    shippingAddress: {
      cep: '24230-053',
      street: 'Avenida Sete de Setembro',
      number: '120',
      complement: 'Bloco B Apto 301',
      neighborhood: 'Icaraí',
      city: 'Niterói',
      state: 'RJ'
    },
    total: 154.85,
    status: 'Entregue',
    paymentMethod: 'CARTÃO DE CRÉDITO',
    trackingCode: 'BR445566778AA',
    items: [
      {
        name: 'Kit Teclado e mouse RGB KA-688',
        qty: 1,
        price: 154.85,
        color: 'Preto',
        image: '//dcdn-us.mitiendanube.com/stores/004/623/973/products/1506110122e4effgbkfc-29fcab4971e2bb6e4517193972084622-1024-1024.webp'
      }
    ]
  }
];

export const useAdminStore = create(
  persist(
    (set, get) => ({
      adminUser: null,
      isAdminAuthenticated: false,

      // Custom mutable catalog
      products: initialProducts,
      orders: INITIAL_ADMIN_ORDERS,

      // Auth actions
      adminLogin: (email, password) => {
        const cleanEmail = email.trim().toLowerCase();
        // Allow admin login with admin / admin123 or any email with correct password
        if ((cleanEmail === 'admin@imporshopp.com.br' || cleanEmail === 'admin' || cleanEmail.includes('admin')) && password === 'admin123') {
          const user = {
            name: 'Administrador Imporshopp',
            email: cleanEmail === 'admin' ? 'admin@imporshopp.com.br' : cleanEmail,
            role: 'Super Admin'
          };
          set({ adminUser: user, isAdminAuthenticated: true });
          return { success: true };
        }
        return { success: false, message: 'Credenciais inválidas. Use o e-mail admin@imporshopp.com.br e senha admin123' };
      },

      adminLogout: () => {
        set({ adminUser: null, isAdminAuthenticated: false });
      },

      // Orders Management
      updateOrderStatus: (orderId, newStatus, trackingCode = '') => {
        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id === orderId) {
              return {
                ...o,
                status: newStatus,
                trackingCode: trackingCode !== undefined && trackingCode !== '' ? trackingCode : o.trackingCode
              };
            }
            return o;
          })
        }));
      },

      deleteOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.filter((o) => o.id !== orderId)
        }));
      },

      addNewOrder: (order) => {
        set((state) => ({
          orders: [order, ...state.orders]
        }));
      },

      // Products Management (CRUD)
      addProduct: (productData) => {
        const newId = String(Date.now());
        const slug = productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        const newProduct = {
          id: newId,
          slug: slug,
          name: productData.name,
          category: productData.category,
          categoryName: productData.categoryName || productData.category,
          brand: productData.brand || 'Imporshopp',
          price: Number(productData.price),
          comparePrice: productData.comparePrice ? Number(productData.comparePrice) : null,
          discountPercentage: productData.discountPercentage ? Number(productData.discountPercentage) : 0,
          freeShipping: productData.freeShipping ?? true,
          isNew: productData.isNew ?? true,
          isFeatured: productData.isFeatured ?? false,
          isSale: productData.isSale ?? false,
          rating: 5.0,
          reviewsCount: 0,
          weight: productData.weight || '0.3 kg',
          stock: Number(productData.stock) || 10,
          colors: productData.colors?.length > 0 ? productData.colors : [{ name: 'Padrão', hex: '#000000', inStock: true }],
          images: productData.images?.length > 0 ? productData.images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80'],
          description: productData.description || `<p>${productData.name}</p>`
        };

        set((state) => ({
          products: [newProduct, ...state.products]
        }));
        return newProduct;
      },

      updateProduct: (productId, updatedFields) => {
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id === productId) {
              return {
                ...p,
                ...updatedFields,
                price: updatedFields.price !== undefined ? Number(updatedFields.price) : p.price,
                comparePrice: updatedFields.comparePrice ? Number(updatedFields.comparePrice) : null,
                stock: updatedFields.stock !== undefined ? Number(updatedFields.stock) : p.stock
              };
            }
            return p;
          })
        }));
      },

      deleteProduct: (productId) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId)
        }));
      },

      toggleProductFeatured: (productId) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === productId ? { ...p, isFeatured: !p.isFeatured } : p))
        }));
      },

      resetProductsToDefault: () => {
        set({ products: initialProducts });
      }
    }),
    {
      name: 'imporshopp-admin-storage'
    }
  )
);
