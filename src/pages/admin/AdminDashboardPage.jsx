import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  DollarSign, 
  Package, 
  ShoppingBag, 
  Clock, 
  Truck, 
  CheckCircle2, 
  ExternalLink, 
  LogOut, 
  Layers, 
  BarChart3,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { AdminOrdersTab } from './AdminOrdersTab';
import { AdminProductsTab } from './AdminProductsTab';
import { formatPrice } from '../../utils/formatters';

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { adminUser, isAdminAuthenticated, adminLogout, orders, products, resetProductsToDefault } = useAdminStore();
  
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'orders' | 'products'

  // Protected Route Check
  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAdminAuthenticated, navigate]);

  if (!isAdminAuthenticated) {
    return null;
  }

  // Calculate Metrics
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelado')
    .reduce((acc, o) => acc + (Number(o.total) || 0), 0);

  const pendingOrdersCount = orders.filter((o) => o.status === 'Pendente' || o.status === 'Em separação').length;
  const shippedOrdersCount = orders.filter((o) => o.status === 'Enviado').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'Entregue').length;

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-100 flex flex-col">
      
      {/* Top Admin Navigation Header */}
      <header className="bg-[#161b22] border-b border-gray-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand / Logo */}
            <div className="flex items-center gap-3">
              <Link to="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-[#f20606] text-white flex items-center justify-center font-bold text-sm shadow">
                  IS
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-sm tracking-wider uppercase text-white leading-tight">
                    Imporshopp <span className="text-[#f20606] font-normal text-xs">Admin</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">v2.4 Live Management</span>
                </div>
              </Link>
            </div>

            {/* User & Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* Store Link */}
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#0d1117] hover:bg-black border border-gray-700 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-green-400" />
                <span>Ver Loja Online</span>
              </Link>

              {/* Admin Profile Pill */}
              <div className="flex items-center gap-2 px-3 py-1 bg-[#0d1117] border border-gray-800 rounded">
                <div className="w-6 h-6 rounded-full bg-red-950 border border-red-800/80 text-[#f20606] flex items-center justify-center font-bold text-[10px]">
                  AD
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-gray-200 leading-tight">Admin Imporshopp</p>
                  <p className="text-[10px] text-gray-500">{adminUser?.email || 'admin@imporshopp.com.br'}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  adminLogout();
                  navigate('/admin/login');
                }}
                className="p-2 text-gray-400 hover:text-red-400 bg-[#0d1117] hover:bg-red-950/40 border border-gray-800 rounded transition-colors cursor-pointer"
                title="Sair do Painel Admin"
              >
                <LogOut className="w-4 h-4" />
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-2 overflow-x-auto no-scrollbar">
          
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-[4px] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#f20606] text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Visão Geral</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-[4px] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#f20606] text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Pedidos & Status ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-[4px] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-[#f20606] text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Catálogo de Produtos ({products.length})</span>
          </button>

        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              {/* Metric 1: Revenue */}
              <div className="bg-[#161b22] border border-gray-800 rounded-[6px] p-5 relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Faturamento Total</p>
                    <h3 className="text-2xl font-black text-white mt-1">{formatPrice(totalRevenue)}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-950/60 border border-green-800/40 text-green-400 flex items-center justify-center">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-3 text-[11px] text-green-400 flex items-center gap-1 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Vendas confirmadas</span>
                </div>
              </div>

              {/* Metric 2: Total Orders */}
              <div className="bg-[#161b22] border border-gray-800 rounded-[6px] p-5 relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total de Pedidos</p>
                    <h3 className="text-2xl font-black text-white mt-1">{orders.length}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-950/60 border border-blue-800/40 text-blue-400 flex items-center justify-center">
                    <Package className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-3 text-[11px] text-gray-400 flex items-center gap-1">
                  <span>{deliveredOrdersCount} entregues • {shippedOrdersCount} em trânsito</span>
                </div>
              </div>

              {/* Metric 3: Pending / Separação */}
              <div className="bg-[#161b22] border border-gray-800 rounded-[6px] p-5 relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Aguardando Envio</p>
                    <h3 className="text-2xl font-black text-amber-300 mt-1">{pendingOrdersCount}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-amber-950/60 border border-amber-800/40 text-amber-400 flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-3 text-[11px] text-amber-400 flex items-center gap-1 font-semibold">
                  <span>Requer separação ou postagem</span>
                </div>
              </div>

              {/* Metric 4: Total Products */}
              <div className="bg-[#161b22] border border-gray-800 rounded-[6px] p-5 relative overflow-hidden shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Produtos Ativos</p>
                    <h3 className="text-2xl font-black text-white mt-1">{products.length}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-950/60 border border-purple-800/40 text-purple-400 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-3 text-[11px] text-purple-300 flex items-center gap-1 font-semibold">
                  <span>Em 7 categorias ativas</span>
                </div>
              </div>

            </div>

            {/* Quick Actions & Recent Orders Banner */}
            <div className="bg-[#161b22] border border-gray-800 rounded-[6px] p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-gray-800">
                <div>
                  <h3 className="font-extrabold text-base text-white uppercase tracking-wide">
                    Últimos Pedidos Recebidos
                  </h3>
                  <p className="text-xs text-gray-400">
                    Acompanhe e altere o status das vendas recentes da loja
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#f20606] hover:underline flex items-center gap-1"
                >
                  <span>Gerenciar todos os pedidos</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Orders Table preview */}
              <AdminOrdersTab />
            </div>

          </div>
        )}

        {/* Tab 2: Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                Gestão de Pedidos & Rastreamento
              </h2>
              <p className="text-xs text-gray-400">
                Altere o status de cada pedido em tempo real e cadastre códigos de rastreamento dos Correios.
              </p>
            </div>
            <AdminOrdersTab />
          </div>
        )}

        {/* Tab 3: Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                  Gestão do Catálogo de Produtos
                </h2>
                <p className="text-xs text-gray-400">
                  Adicione novos produtos, altere preços, gerencie o estoque e exclua itens da loja.
                </p>
              </div>
            </div>
            <AdminProductsTab />
          </div>
        )}

      </main>

      {/* Admin Footer */}
      <footer className="border-t border-gray-800/80 bg-[#161b22] py-4 text-center text-xs text-gray-500">
        Imporshopp Store Management • Painel Administrativo Seguro
      </footer>

    </div>
  );
};
