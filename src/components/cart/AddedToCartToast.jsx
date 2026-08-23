import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { formatPrice } from '../../utils/formatters';

export const AddedToCartToast = () => {
  const navigate = useNavigate();
  const { showToast, lastAddedItem, closeToast, openCart, getTotalItemsCount, getTotal } = useCartStore();

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        closeToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast, closeToast]);

  if (!showToast || !lastAddedItem) return null;

  const totalItems = getTotalItemsCount();
  const total = getTotal();

  return (
    <div className="fixed top-16 sm:top-[72px] right-2 sm:right-6 lg:right-10 z-50 max-w-[360px] sm:max-w-[400px] w-full animate-in slide-in-from-top-2 fade-in duration-200">
      
      {/* Pop-up Container anchored below the cart basket */}
      <div className="bg-white rounded-[4px] shadow-2xl border border-gray-200 overflow-hidden relative">
        
        {/* Little decorative arrow pointing up to the cart icon */}
        <div className="absolute -top-1.5 right-6 w-3 h-3 bg-white border-t border-l border-gray-200 transform rotate-45 z-10" />

        {/* Pop-up Header */}
        <div className="bg-neutral-900 text-white px-3.5 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#3fef09] text-black flex items-center justify-center font-bold">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-100">
              Adicionado ao Carrinho!
            </span>
          </div>
          <button
            onClick={closeToast}
            className="text-gray-400 hover:text-white p-1 transition-colors cursor-pointer"
            aria-label="Fechar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pop-up Body: Product Summary */}
        <div className="p-3.5 sm:p-4 bg-white">
          <div className="flex items-center gap-3">
            
            {/* Thumbnail */}
            <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-[4px] p-1 flex items-center justify-center shrink-0">
              <img
                src={lastAddedItem.product.images[0]}
                alt={lastAddedItem.product.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-gray-900 line-clamp-1 leading-snug">
                {lastAddedItem.product.name}
              </h4>
              {lastAddedItem.colorName && lastAddedItem.colorName !== 'Padrão' && (
                <p className="text-[11px] text-gray-500">
                  Cor: <strong className="text-gray-700">{lastAddedItem.colorName}</strong>
                </p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-extrabold text-[#f20606]">
                  {lastAddedItem.quantity}x {formatPrice(lastAddedItem.product.price)}
                </span>
                {lastAddedItem.product.discountPercentage > 0 && (
                  <span className="bg-red-100 text-[#f20606] font-bold text-[9px] px-1 py-0.2 rounded">
                    -{lastAddedItem.product.discountPercentage}%
                  </span>
                )}
              </div>
            </div>

          </div>

          {/* Subtotal Preview */}
          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-600 font-medium">
              Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'itens'}):
            </span>
            <span className="font-extrabold text-sm text-gray-900">
              {formatPrice(total)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                closeToast();
                openCart();
              }}
              className="w-full py-2 px-2.5 rounded-[4px] border border-gray-300 hover:border-black text-[11px] font-bold uppercase tracking-wider text-gray-800 hover:bg-gray-50 transition-colors text-center cursor-pointer"
            >
              Ver Carrinho
            </button>
            <button
              onClick={() => {
                closeToast();
                navigate('/checkout');
              }}
              className="btn-primary w-full py-2 px-2.5 text-[11px] uppercase tracking-wider text-center flex items-center justify-center gap-1 shadow-sm cursor-pointer"
            >
              <span>Finalizar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
