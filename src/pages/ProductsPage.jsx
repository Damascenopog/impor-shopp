import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronDown, X, Check } from 'lucide-react';
import { products } from '../data/products';
import { categories, colorFilters, sortOptions } from '../data/categories';
import { ProductCard } from '../components/product/ProductCard';
import { formatPrice } from '../utils/formatters';

export const ProductsPage = ({ defaultCategory = 'todos', pageTitle = 'Produtos' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [selectedColors, setSelectedColors] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('mais-vendidos');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Toggle color filter
  const handleToggleColor = (colorName) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCategory('todos');
    setSelectedColors([]);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('mais-vendidos');
  };

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'todos' && product.category !== selectedCategory) {
          return false;
        }

        // Color filter
        if (selectedColors.length > 0) {
          const productColors = product.colors?.map((c) => c.name) || [];
          const hasMatchingColor = selectedColors.some((c) => productColors.includes(c));
          if (!hasMatchingColor) return false;
        }

        // Price range filter
        if (minPrice && product.price < Number(minPrice)) return false;
        if (maxPrice && product.price > Number(maxPrice)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'preco-menor') return a.price - b.price;
        if (sortBy === 'preco-maior') return b.price - a.price;
        if (sortBy === 'a-z') return a.name.localeCompare(b.name);
        if (sortBy === 'z-a') return b.name.localeCompare(a.name);
        if (sortBy === 'mais-novo') return Number(b.id) - Number(a.id);
        if (sortBy === 'mais-antigo') return Number(a.id) - Number(b.id);
        return (b.reviewsCount || 0) - (a.reviewsCount || 0); // mais-vendidos default
      });
  }, [selectedCategory, selectedColors, minPrice, maxPrice, sortBy]);

  return (
    <div className="min-h-screen pb-16">
      
      {/* Breadcrumb & Header Banner */}
      <div className="bg-neutral-900 text-white py-6 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            <span>/</span>
            <span className="text-white font-medium">{pageTitle}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide">
            {pageTitle}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Exibindo {filteredProducts.length} {filteredProducts.length === 1 ? 'produto' : 'produtos'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Top Control Bar (Mobile Filters toggle & Sorting) */}
        <div className="bg-white rounded-[4px] border border-gray-100 p-3 sm:p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden w-full sm:w-auto flex items-center justify-center gap-2 py-2.5 px-4 bg-black text-white text-xs font-bold uppercase rounded-[4px] tracking-wider"
          >
            <Filter className="w-4 h-4 text-[#3fef09]" />
            <span>Filtrar ({selectedColors.length + (selectedCategory !== 'todos' ? 1 : 0) + (minPrice || maxPrice ? 1 : 0)})</span>
          </button>

          {/* Active Filter Chips */}
          <div className="hidden lg:flex items-center gap-2 flex-wrap text-xs">
            <span className="font-semibold text-gray-700">Filtros ativos:</span>
            {selectedCategory !== 'todos' && (
              <span className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-[3px] flex items-center gap-1 font-medium">
                Categoria: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => setSelectedCategory('todos')} />
              </span>
            )}
            {selectedColors.map((color) => (
              <span key={color} className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-[3px] flex items-center gap-1 font-medium">
                Cor: {color}
                <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => handleToggleColor(color)} />
              </span>
            ))}
            {(minPrice || maxPrice) && (
              <span className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-[3px] flex items-center gap-1 font-medium">
                Preço: {minPrice ? formatPrice(minPrice) : 'R$ 0'} - {maxPrice ? formatPrice(maxPrice) : 'Max'}
                <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => { setMinPrice(''); setMaxPrice(''); }} />
              </span>
            )}
            {(selectedCategory !== 'todos' || selectedColors.length > 0 || minPrice || maxPrice) && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-red-600 font-bold hover:underline ml-2"
              >
                Limpar todos
              </button>
            )}
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-gray-500 hidden sm:inline whitespace-nowrap">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-800 text-xs rounded-[4px] px-3 py-2 focus:border-black focus:outline-none w-full sm:w-auto font-medium"
            >
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Main Content Layout (Sidebar + Products Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block bg-white rounded-[4px] border border-gray-100 p-5 shadow-2xs space-y-6">
            
            {/* Category Filter */}
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-3 border-b border-gray-100 pb-2">
                Categorias
              </h3>
              <div className="space-y-1.5 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug === 'produtos' ? 'todos' : cat.slug)}
                    className={`w-full text-left py-1.5 px-2 rounded-[3px] transition-colors flex items-center justify-between ${
                      (selectedCategory === 'todos' && cat.slug === 'produtos') || selectedCategory === cat.slug
                        ? 'bg-red-50 text-[#f20606] font-bold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-black font-medium'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Colors Filter */}
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-3 border-b border-gray-100 pb-2">
                Cores
              </h3>
              <div className="space-y-2 text-xs">
                {colorFilters.map((col) => {
                  const isChecked = selectedColors.includes(col.name);
                  return (
                    <label
                      key={col.name}
                      onClick={() => handleToggleColor(col.name)}
                      className="flex items-center justify-between cursor-pointer py-1 px-1.5 rounded hover:bg-gray-50 text-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center"
                          style={{ backgroundColor: col.hex }}
                        >
                          {isChecked && (
                            <Check className={`w-3 h-3 ${col.hex === '#ffffff' ? 'text-black' : 'text-white'}`} />
                          )}
                        </span>
                        <span className={isChecked ? 'font-bold text-black' : ''}>{col.name}</span>
                      </div>
                      <span className="text-[11px] text-gray-400 font-mono">({col.count})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-3 border-b border-gray-100 pb-2">
                Faixa de Preço
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5 focus:border-black focus:outline-none text-xs"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5 focus:border-black focus:outline-none text-xs"
                />
              </div>
            </div>

            {/* Clear Filters CTA */}
            <button
              onClick={handleResetFilters}
              className="w-full py-2 border border-gray-200 hover:border-black rounded-[3px] text-xs font-semibold text-gray-700 hover:text-black transition-colors"
            >
              Limpar Filtros
            </button>

          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-[4px] border border-gray-100 p-12 text-center shadow-2xs">
                <p className="text-base font-bold text-gray-800 mb-1">Nenhum produto encontrado</p>
                <p className="text-xs text-gray-500 mb-4">
                  Não encontramos itens para os filtros selecionados. Tente remover filtros de cor ou faixa de preço.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="btn-primary text-xs uppercase"
                >
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>

        </div>

      </div>

      {/* Mobile Filter Drawer Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-left">
            <div className="p-4 bg-black text-white flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wider">Filtros de Produtos</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Category Filter */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-2">
                  Categorias
                </h4>
                <div className="space-y-1 text-xs">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.slug === 'produtos' ? 'todos' : cat.slug);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left py-2 px-2.5 rounded transition-colors ${
                        (selectedCategory === 'todos' && cat.slug === 'produtos') || selectedCategory === cat.slug
                          ? 'bg-red-50 text-[#f20606] font-bold'
                          : 'text-gray-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors Filter */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-2">
                  Cores
                </h4>
                <div className="space-y-2 text-xs">
                  {colorFilters.map((col) => {
                    const isChecked = selectedColors.includes(col.name);
                    return (
                      <label
                        key={col.name}
                        onClick={() => handleToggleColor(col.name)}
                        className="flex items-center justify-between cursor-pointer py-1.5 px-2 rounded hover:bg-gray-50 text-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: col.hex }}
                          />
                          <span className={isChecked ? 'font-bold' : ''}>{col.name}</span>
                        </div>
                        <span className="text-gray-400 font-mono">({col.count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-2">
                  Faixa de Preço
                </h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded p-2 text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded p-2 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="btn-primary w-full py-3 text-xs uppercase"
              >
                Ver {filteredProducts.length} Produtos
              </button>
              <button
                onClick={handleResetFilters}
                className="w-full py-2 text-xs text-gray-600 hover:text-black font-semibold"
              >
                Limpar Todos
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
