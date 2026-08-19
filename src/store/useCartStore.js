import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      shippingZip: '',
      shippingCost: 0,
      shippingOption: null,
      coupon: null,
      lastAddedItem: null,
      showToast: false,

      openCart: () => set({ isOpen: true, showToast: false }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, quantity = 1, selectedColor = null) => {
        const colorName = selectedColor?.name || product.colors?.[0]?.name || 'Padrão';
        const colorHex = selectedColor?.hex || product.colors?.[0]?.hex || '#000000';
        
        const existingIndex = get().items.findIndex(
          (item) => item.product.id === product.id && item.colorName === colorName
        );

        let newItems;
        if (existingIndex > -1) {
          newItems = [...get().items];
          newItems[existingIndex].quantity += quantity;
        } else {
          newItems = [
            ...get().items,
            {
              product,
              quantity,
              colorName,
              colorHex,
              addedAt: Date.now()
            }
          ];
        }

        set({
          items: newItems,
          lastAddedItem: {
            product,
            quantity,
            colorName,
            colorHex
          },
          showToast: true
        });
      },

      removeItem: (productId, colorName) => {
        set({
          items: get().items.filter(
            (item) => !(item.product.id === productId && item.colorName === colorName)
          )
        });
      },

      updateQuantity: (productId, colorName, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, colorName);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.product.id === productId && item.colorName === colorName
              ? { ...item, quantity }
              : item
          )
        });
      },

      clearCart: () => set({ items: [], shippingCost: 0, shippingOption: null, coupon: null }),

      setShipping: (zip, cost = 0, option = null) => {
        set({ shippingZip: zip, shippingCost: cost, shippingOption: option });
      },

      applyCoupon: (code) => {
        const cleanCode = code.trim().toUpperCase();
        if (cleanCode === 'IMPOR10' || cleanCode === 'BEMVINDO') {
          set({ coupon: { code: cleanCode, discountPercent: 10 } });
          return { success: true, message: 'Cupom de 10% de desconto aplicado com sucesso!' };
        } else if (cleanCode === 'FRETEGRATIS') {
          set({ coupon: { code: cleanCode, freeShipping: true } });
          return { success: true, message: 'Cupom de Frete Grátis aplicado com sucesso!' };
        }
        return { success: false, message: 'Cupom inválido ou expirado.' };
      },

      removeCoupon: () => set({ coupon: null }),

      closeToast: () => set({ showToast: false }),

      // Calculators
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const coupon = get().coupon;
        if (coupon?.discountPercent) {
          return (subtotal * coupon.discountPercent) / 100;
        }
        return 0;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const shipping = get().coupon?.freeShipping ? 0 : get().shippingCost;
        return Math.max(0, subtotal - discount + shipping);
      },

      getTotalItemsCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'imporshopp-cart-storage',
      partialize: (state) => ({
        items: state.items,
        shippingZip: state.shippingZip,
        shippingCost: state.shippingCost,
        shippingOption: state.shippingOption,
        coupon: state.coupon
      })
    }
  )
);
