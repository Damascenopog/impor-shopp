import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { useAdminStore } from '../store/useAdminStore';

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const products = useAdminStore((state) => state.products);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const cleanQ = query.toLowerCase();
    return products.filter((p) =>
      p.name.toLowerCase().includes(cleanQ) ||
      p.brand?.toLowerCase().includes(cleanQ) ||
      p.categoryName?.toLowerCase().includes(cleanQ) ||
      p.description?.toLowerCase().includes(cleanQ)
    );
  }, [query, products]);

  return (
    <div className="min-h-screen pb-16">
      
      {/* Header */}
      <div className="bg-neutral-900 text-white py-6 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            <span>/</span>
            <span className="text-white font-medium">Busca</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide">
            Resultados para: "{query}"
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Encontramos {searchResults.length} {searchResults.length === 1 ? 'produto correspondente' : 'produtos correspondentes'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {searchResults.length === 0 ? (
          <div className="bg-white rounded-[4px] border border-gray-100 p-12 text-center shadow-xs">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Search className="w-8 h-8" />
            </div>
            <h2 className="text-base font-bold text-gray-800 mb-1">
              Nenhum produto encontrado para "{query}"
            </h2>
            <p className="text-xs text-gray-500 mb-6 max-w-sm mx-auto">
              Verifique a ortografia da palavra ou tente buscar por termos mais genéricos, como "caixa de som" ou "smartwatch".
            </p>
            <Link to="/produtos" className="btn-primary text-xs uppercase px-6 py-3">
              Ver Todos os Produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
