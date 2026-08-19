import React from 'react';
import { ProductCard } from './ProductCard';

export const ProductGrid = ({ products, title, subtitle, columns = 4 }) => {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-[4px] p-12 text-center border border-gray-100 my-6">
        <p className="text-sm font-semibold text-gray-700 mb-1">Nenhum produto encontrado</p>
        <p className="text-xs text-gray-500">Tente ajustar seus filtros ou busca.</p>
      </div>
    );
  }

  const gridColsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
  }[columns] || 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';

  return (
    <section className="my-6">
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-[#f20606] rounded-full inline-block"></span>
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5 ml-3.5">{subtitle}</p>
          )}
        </div>
      )}

      <div className={`grid ${gridColsClass} gap-3 sm:gap-4 lg:gap-5`}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
