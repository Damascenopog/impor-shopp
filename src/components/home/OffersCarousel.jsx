import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';

export const OffersCarousel = ({ products = [], title = "Ofertas Imperdíveis" }) => {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="my-10 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-red-100 text-[#f20606] rounded-[4px]">
            <Flame className="w-5 h-5 fill-[#f20606]" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold uppercase tracking-wider text-gray-900">
              {title}
            </h2>
            <p className="text-xs text-gray-500">Produtos com até 35% de desconto</p>
          </div>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleScroll('left')}
            className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:border-black text-gray-700 hover:text-black flex items-center justify-center shadow-xs transition-colors"
            aria-label="Rolar para esquerda"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:border-black text-gray-700 hover:text-black flex items-center justify-center shadow-xs transition-colors"
            aria-label="Rolar para direita"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal scrolling slider */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 no-scrollbar snap-x snap-mandatory"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[240px] sm:w-[260px] md:w-[280px] shrink-0 snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};
