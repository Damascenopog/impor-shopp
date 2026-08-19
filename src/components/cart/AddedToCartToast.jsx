import React from 'react';
import { X, Check, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { formatPrice } from '../../utils/formatters';

export const AddedToCartToast = () => {
  const { showToast, lastAddedItem, closeToast, openCart, getTotalItemsCount, getTotal } = useCartStore();

  if (!showToast || !lastAddedItem) return null;

  const totalItems = getTotalItemsCount();
  const total = getTotal();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-[4px] shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-[#000000] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span className="font-bold text-xs uppercase tracking-wider">
              Adicionado ao carrinho!
            </span>
          </div>
          <button
            onClick={closeToast}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Fechar notificação"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5">
          <div className="flex gap-4 items-center">
            {/* Product Image */}
            <div className="w-20 h-20 bg-white border border-gray-100 rounded-[4px] p-1 flex items-center justify-center shrink-0">
              <img
                src={lastAddedItem.product.images[0]}
                alt={lastAddedItem.product.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2">
                {lastAddedItem.product.name}
              </h4>
              {lastAddedItem.colorName && lastAddedItem.colorName !== 'Padrão' && (
                <p className="text-[11px] text-gray-500 mt-0.5">
                  ({lastAddedItem.colorName})
                </p>
              )}
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs font-bold text-gray-700">
                  {lastAddedItem.quantity} x {formatPrice(lastAddedItem.product.price)}
                </span>
                {lastAddedItem.product.discountPercentage > 0 && (
                  <span className="bg-[#C8FF55] text-gray-900 font-bold text-[10px] px-1.5 py-0.5 rounded">
                    -{lastAddedItem.product.discountPercentage}% OFF
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Subtotal preview */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-600 font-medium">
              Total ({totalItems} {totalItems === 1 ? 'produto' : 'produtos'}):
            </span>
            <span className="text-sm font-extrabold text-[#f20606]">
              {formatPrice(total)}
            </span>
          </div>

          {/* Actions */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={closeToast}
              className="w-full py-2.5 px-3 rounded-[4px] border border-gray-300 hover:border-black text-xs font-semibold text-gray-700 hover:text-black transition-colors text-center"
            >
              Continuar comprando
            </button>
            <button
              onClick={() => {
                closeToast();
                openCart();
              }}
              className="w-full py-2.5 px-3 rounded-[4px] bg-[#f20606] hover:bg-[#d40505] text-xs font-bold text-white uppercase tracking-wider transition-colors text-center flex items-center justify-center gap-1.5 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Ver Carrinho</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
