import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronDown, ChevronRight, User, ShoppingBag, Phone } from 'lucide-react';
import { categories } from '../../data/categories';
import { WhatsAppIcon } from '../common/Icons';
import { useAuthStore } from '../../store/useAuthStore';

export const MobileMenu = ({ isOpen, onClose }) => {
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(true);
  const { user, isAuthenticated, logout } = useAuthStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#111111] text-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-black">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold uppercase tracking-wider">
              IMPOR<span className="text-[#f20606]">SHOPP</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-gray-400 hover:text-white transition-colors"
            aria-label="Fechar Menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Greeting / Auth Buttons */}
        <div className="p-4 bg-[#1a1a1a] border-b border-neutral-800">
          {isAuthenticated ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f20606] text-white flex items-center justify-center font-bold text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Olá, {user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="text-xs text-red-500 font-semibold hover:underline"
                >
                  Sair
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-neutral-800 text-center">
                <Link
                  to="/account"
                  onClick={onClose}
                  className="py-1.5 px-1 bg-neutral-900 hover:bg-neutral-800 rounded text-[11px] font-semibold text-gray-300 hover:text-white"
                >
                  Meus Dados
                </Link>
                <Link
                  to="/account?tab=addresses"
                  onClick={onClose}
                  className="py-1.5 px-1 bg-neutral-900 hover:bg-neutral-800 rounded text-[11px] font-semibold text-gray-300 hover:text-white"
                >
                  Endereços
                </Link>
                <Link
                  to="/account?tab=orders"
                  onClick={onClose}
                  className="py-1.5 px-1 bg-neutral-900 hover:bg-neutral-800 rounded text-[11px] font-semibold text-gray-300 hover:text-white"
                >
                  Pedidos
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/account/login"
                onClick={onClose}
                className="flex-1 text-center py-2 text-xs font-bold uppercase bg-[#f20606] hover:bg-[#d40505] rounded-[4px] transition-colors"
              >
                Entrar
              </Link>
              <Link
                to="/account/register"
                onClick={onClose}
                className="flex-1 text-center py-2 text-xs font-bold uppercase bg-neutral-800 hover:bg-neutral-700 text-white rounded-[4px] border border-neutral-700 transition-colors"
              >
                Cadastre-se
              </Link>
            </div>
          )}
        </div>

        {/* Navigation Links Scrollable List */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          
          {/* Início */}
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-[4px] text-sm font-medium text-gray-200 hover:bg-neutral-800 hover:text-white"
          >
            Início
          </Link>

          {/* Produtos & Categories Accordion */}
          <div>
            <button
              onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-[4px] text-sm font-medium text-gray-200 hover:bg-neutral-800 hover:text-white"
            >
              <span>Categorias de Produtos</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCategoriesExpanded ? 'rotate-180' : ''}`} />
            </button>

            {isCategoriesExpanded && (
              <div className="pl-4 pr-1 py-1 space-y-1 bg-black/30 rounded my-1 border-l border-neutral-800">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={cat.slug === 'produtos' ? '/produtos' : `/${cat.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between px-3 py-2 rounded text-xs font-normal text-gray-300 hover:bg-neutral-800 hover:text-[#f20606] transition-colors"
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Original Apple Highlight */}
          <Link
            to="/original-apple"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-[4px] text-sm font-bold text-[#3fef09] hover:bg-neutral-800"
          >
            Original Apple
            <span className="text-[10px] bg-[#3fef09]/20 text-[#3fef09] px-2 py-0.5 rounded font-mono">100% Original</span>
          </Link>

          {/* Institutional Links */}
          <div className="pt-2 border-t border-neutral-800 space-y-1">
            <Link
              to="/contato"
              onClick={onClose}
              className="block px-3 py-2 rounded-[4px] text-xs font-medium text-gray-300 hover:bg-neutral-800 hover:text-white"
            >
              Contato
            </Link>
            <Link
              to="/perguntas-frequentes"
              onClick={onClose}
              className="block px-3 py-2 rounded-[4px] text-xs font-medium text-gray-300 hover:bg-neutral-800 hover:text-white"
            >
              Perguntas Frequentes
            </Link>
            <Link
              to="/como-comprar"
              onClick={onClose}
              className="block px-3 py-2 rounded-[4px] text-xs font-medium text-gray-300 hover:bg-neutral-800 hover:text-white"
            >
              Como Comprar
            </Link>
            <Link
              to="/trocas-e-devolucoes"
              onClick={onClose}
              className="block px-3 py-2 rounded-[4px] text-xs font-medium text-gray-300 hover:bg-neutral-800 hover:text-white"
            >
              Trocas e Devoluções
            </Link>
            <Link
              to="/quem-somos"
              onClick={onClose}
              className="block px-3 py-2 rounded-[4px] text-xs font-medium text-gray-300 hover:bg-neutral-800 hover:text-white"
            >
              Quem Somos
            </Link>
          </div>

        </div>

        {/* Drawer Footer Contact */}
        <div className="p-4 bg-black border-t border-neutral-800">
          <a
            href="https://wa.me/5521972893879"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs rounded-[4px] transition-colors"
          >
            <WhatsAppIcon className="w-4 h-4 fill-black" />
            Fale Conosco pelo WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
};
