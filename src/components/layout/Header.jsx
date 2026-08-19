import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Menu, X, ChevronDown, ShoppingBag } from 'lucide-react';
import { WhatsAppIcon, NuvemshopUserIcon, NuvemshopCartBasketIcon } from '../common/Icons';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { categories } from '../../data/categories';
import { products } from '../../data/products';
import { formatPrice } from '../../utils/formatters';

export const Header = ({ onOpenMobileMenu }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const categoriesRef = useRef(null);
  const accountRef = useRef(null);

  const totalItems = useCartStore((state) => state.getTotalItemsCount());
  const openCart = useCartStore((state) => state.openCart);
  const { user, isAuthenticated, logout } = useAuthStore();

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setIsCategoriesOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products for suggestions
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const results = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setFilteredSuggestions(results);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="w-full bg-[#000000] text-white sticky top-0 z-40 shadow-md">
      {/* Top Main Navigation Bar (Largura Total com margens fiéis) */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-20 sm:h-24 gap-4 sm:gap-6 lg:gap-8">
          
          {/* Store Official Logo (Ponta Esquerda da Tela) */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center" title="Imporshopp">
              <img
                src="//dcdn-us.mitiendanube.com/stores/004/623/973/themes/common/logo-1578423942-1717014959-6bc23181dff0d0f58f7e3c2ed7860a801717014960.png?0"
                alt="Imporshopp"
                className="h-10 sm:h-12 md:h-14 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Search Bar - Desktop (Barra de busca branca centralizada com flex-1) */}
          <div className="hidden lg:flex flex-1 max-w-3xl mx-4 sm:mx-6 lg:mx-10 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length > 1 && setShowSuggestions(true)}
                placeholder="O que você está buscando?"
                className="w-full bg-white text-[#333333] text-xs sm:text-sm rounded-[2px] pl-4 pr-11 py-2.5 sm:py-3 focus:outline-none placeholder:text-gray-500 font-normal shadow-xs"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 px-3.5 text-gray-700 hover:text-black transition-colors flex items-center justify-center"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5 stroke-[1.75]" />
              </button>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white text-gray-900 rounded-[2px] shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                {filteredSuggestions.length > 0 ? (
                  <div className="py-2">
                    <div className="px-4 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Sugestões de Produtos
                    </div>
                    {filteredSuggestions.map((item) => (
                      <Link
                        key={item.id}
                        to={`/produtos/${item.slug}`}
                        onClick={() => setShowSuggestions(false)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                      >
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-10 h-10 object-contain bg-white rounded p-1 border border-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-800 line-clamp-1">{item.name}</p>
                          <p className="text-xs font-bold text-[#f20606] mt-0.5">{formatPrice(item.price)}</p>
                        </div>
                      </Link>
                    ))}
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full text-center py-2 text-xs font-bold text-[#f20606] bg-red-50 hover:bg-red-100 transition-colors block"
                    >
                      Ver todos os resultados para "{searchQuery}"
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-gray-500">
                    Nenhum produto encontrado para "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Header Action Items (Ponta Direita da Tela) */}
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
            
            {/* Account / User Widget */}
            <div className="relative" ref={accountRef}>
              {isAuthenticated ? (
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
                >
                  <NuvemshopUserIcon className="w-6 h-6 text-white shrink-0" />
                  <div className="hidden lg:block text-left text-xs leading-tight">
                    <span className="font-bold text-white block truncate max-w-[100px]">Olá, {user?.name}</span>
                    <span className="text-[11px] text-gray-300">Minha Conta</span>
                  </div>
                </button>
              ) : (
                <div className="flex items-center gap-2 text-white">
                  <Link to="/account/login" className="flex items-center text-white hover:text-gray-300">
                    <NuvemshopUserIcon className="w-6 h-6 text-white shrink-0" />
                  </Link>
                  <div className="hidden lg:block text-left text-xs leading-tight">
                    <div className="font-bold text-white whitespace-nowrap">
                      Olá! <Link to="/account/login" className="hover:underline font-bold text-white">Faça login</Link>
                    </div>
                    <Link to="/account/register" className="text-[11px] text-gray-300 hover:text-white hover:underline block whitespace-nowrap">
                      Ou cadastre-se
                    </Link>
                  </div>
                </div>
              )}

              {/* User Dropdown */}
              {isAuthenticated && isAccountMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white text-gray-900 rounded-[4px] shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-800 truncate">{user?.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/account/orders"
                    onClick={() => setIsAccountMenuOpen(false)}
                    className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Meus Pedidos
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsAccountMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors font-medium"
                  >
                    Sair da Conta
                  </button>
                </div>
              )}
            </div>

            {/* WhatsApp Icon (Outline limpo branco) */}
            <a
              href="https://wa.me/5521972893879"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#3fef09] transition-colors p-1"
              title="Atendimento WhatsApp"
              aria-label="Fale conosco pelo WhatsApp"
            >
              <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
            </a>

            {/* Shopping Basket Cart Button (Cesto com contador superior 0) */}
            <button
              onClick={openCart}
              className="relative p-1 text-white hover:text-red-500 transition-colors flex items-center"
              aria-label="Ver Carrinho"
            >
              <div className="relative flex items-center">
                <NuvemshopCartBasketIcon className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
                <span className="text-xs font-bold text-white ml-0.5 self-start -mt-0.5 font-mono">
                  {totalItems}
                </span>
              </div>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-1 text-white hover:text-gray-300 focus:outline-none flex items-center justify-center ml-1"
              aria-label="Abrir Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Vertical Divider line on the far right (fiel à imagem 2) */}
            <div className="hidden lg:block h-8 w-[1px] bg-neutral-800 ml-2"></div>

          </div>

        </div>

        {/* Mobile Search Bar (Branca no mobile também) */}
        <div className="lg:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="O que você está buscando?"
              className="w-full bg-white text-[#333333] text-xs rounded-[2px] pl-3 pr-10 py-2.5 focus:outline-none placeholder:text-gray-500 font-normal shadow-xs"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 bottom-0 px-3 text-gray-700 hover:text-black flex items-center justify-center"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Desktop Category and Navigation Links Bar */}
      <nav className="hidden lg:block border-t border-neutral-800 bg-[#000000]">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex items-center space-x-1 h-12 text-sm font-medium">
            
            {/* Categorias Dropdown */}
            <div className="relative" ref={categoriesRef}>
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className={`flex items-center gap-1.5 px-4 py-3 rounded-t-[4px] uppercase text-xs tracking-wider font-bold transition-colors ${
                  isCategoriesOpen ? 'bg-neutral-800 text-white' : 'hover:bg-neutral-900 text-white'
                }`}
              >
                CATEGORIAS
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoriesOpen && (
                <div className="absolute left-0 top-full w-64 bg-white text-gray-900 rounded-b-[4px] shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={cat.slug === 'produtos' ? '/produtos' : `/${cat.slug}`}
                      onClick={() => setIsCategoriesOpen(false)}
                      className="block px-4 py-2 text-xs font-medium text-gray-700 hover:bg-red-50 hover:text-[#f20606] transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Menu Links */}
            <Link to="/" className="px-3.5 py-2 text-xs font-medium hover:text-[#f20606] transition-colors uppercase">
              Início
            </Link>
            <Link to="/produtos" className="px-3.5 py-2 text-xs font-medium hover:text-[#f20606] transition-colors uppercase">
              Produtos
            </Link>
            <Link to="/original-apple" className="px-3.5 py-2 text-xs font-semibold text-[#3fef09] hover:underline uppercase flex items-center gap-1">
              Original Apple
            </Link>
            <Link to="/contato" className="px-3.5 py-2 text-xs font-medium hover:text-[#f20606] transition-colors uppercase">
              Contato
            </Link>
            <Link to="/perguntas-frequentes" className="px-3.5 py-2 text-xs font-medium hover:text-[#f20606] transition-colors uppercase">
              Perguntas Frequentes
            </Link>
            <Link to="/como-comprar" className="px-3.5 py-2 text-xs font-medium hover:text-[#f20606] transition-colors uppercase">
              Como Comprar
            </Link>
            <Link to="/trocas-e-devolucoes" className="px-3.5 py-2 text-xs font-medium hover:text-[#f20606] transition-colors uppercase">
              Trocas e Devoluções
            </Link>
            <Link to="/quem-somos" className="px-3.5 py-2 text-xs font-medium hover:text-[#f20606] transition-colors uppercase">
              Quem Somos
            </Link>

          </div>
        </div>
      </nav>
    </header>
  );
};
