import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye } from 'lucide-react';
import { TruckIcon } from '../common/Icons';
import { formatPrice, calculateInstallments } from '../../utils/formatters';
import { useCartStore } from '../../store/useCartStore';

export const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const hasSecondaryImage = product.images && product.images.length > 1;
  const installments = calculateInstallments(product.price, 12);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, product.colors?.[0] || null);
  };

  return (
    <div
      className="group bg-white rounded-[4px] border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Link Container */}
      <div className="relative aspect-square w-full bg-white p-4 overflow-hidden flex items-center justify-center">
        
        {/* Badges Floating Group */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
          {product.discountPercentage > 0 && (
            <span className="badge-offer">
              -{product.discountPercentage}% OFF
            </span>
          )}
          {product.freeShipping && (
            <span className="badge-free-shipping">
              <TruckIcon className="w-3.5 h-3.5 text-gray-800" />
              <span>Grátis</span>
            </span>
          )}
        </div>

        <Link
          to={`/produtos/${product.slug}`}
          className="w-full h-full flex items-center justify-center"
        >
          {/* Primary Image */}
          <img
            src={product.images[0]}
            alt={product.name}
            className={`w-full h-full object-contain transition-all duration-500 ${
              isHovered && hasSecondaryImage ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            }`}
            loading="lazy"
          />

          {/* Secondary Hover Image */}
          {hasSecondaryImage && (
            <img
              src={product.images[1]}
              alt={`${product.name} - imagem 2`}
              className={`w-full h-full object-contain absolute inset-0 p-4 transition-all duration-500 ${
                isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-95'
              }`}
              loading="lazy"
            />
          )}
        </Link>

        {/* Quick Action Button on Hover (Desktop) */}
        <div className="absolute bottom-2.5 inset-x-2.5 z-10 hidden sm:flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleQuickAdd}
            className="flex-1 bg-[#f20606] hover:bg-[#d40505] text-white text-[11px] font-bold py-2 px-3 rounded-[3px] shadow-md transition-colors flex items-center justify-center gap-1.5 uppercase tracking-wider"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Comprar</span>
          </button>
          <Link
            to={`/produtos/${product.slug}`}
            className="bg-black/80 hover:bg-black text-white p-2 rounded-[3px] shadow-md transition-colors flex items-center justify-center"
            title="Ver Detalhes"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* Product Details info */}
      <div className="p-3.5 sm:p-4 border-t border-gray-50 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Brand/Category Tag */}
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-1">
            {product.brand || product.categoryName}
          </span>

          {/* Title */}
          <Link
            to={`/produtos/${product.slug}`}
            className="text-xs sm:text-sm font-semibold text-gray-800 hover:text-[#f20606] transition-colors line-clamp-2 leading-snug mb-2"
            title={product.name}
          >
            {product.name}
          </Link>
        </div>

        {/* Price and Installments */}
        <div className="mt-2 pt-2 border-t border-gray-50">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-sm sm:text-base font-extrabold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          <p className="text-[11px] text-gray-500 font-medium mt-0.5">
            Ou 12x de <span className="font-semibold text-gray-700">{formatPrice(installments.value)}</span>
          </p>

          {/* Mobile Buy Button */}
          <div className="sm:hidden mt-3">
            <button
              onClick={handleQuickAdd}
              className="w-full bg-[#f20606] text-white text-xs font-bold py-2 rounded-[3px] uppercase tracking-wider shadow-xs"
            >
              Comprar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
