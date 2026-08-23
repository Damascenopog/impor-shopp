import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Eye, 
  Edit3, 
  Trash2, 
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { formatPrice } from '../../utils/formatters';

const STATUS_CONFIG = {
  'Pendente': { bg: 'bg-amber-950/40 text-amber-300 border-amber-800/60', icon: Clock, label: 'Pendente' },
  'Em separação': { bg: 'bg-blue-950/40 text-blue-300 border-blue-800/60', icon: Package, label: 'Em separação' },
  'Enviado': { bg: 'bg-purple-950/40 text-purple-300 border-purple-800/60', icon: Truck, label: 'Enviado' },
  'Entregue': { bg: 'bg-green-950/40 text-green-300 border-green-800/60', icon: CheckCircle2, label: 'Entregue' },
  'Cancelado': { bg: 'bg-red-950/40 text-red-300 border-red-800/60', icon: XCircle, label: 'Cancelado' }
};

export const AdminOrdersTab = () => {
  const { orders, updateOrderStatus, deleteOrder } = useAdminStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingTrackingId, setEditingTrackingId] = useState(null);
  const [trackingInput, setTrackingInput] = useState('');

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.trackingCode?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'Todos' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSaveTracking = (orderId) => {
    updateOrderStatus(orderId, undefined, trackingInput.trim().toUpperCase());
    setEditingTrackingId(null);
    setTrackingInput('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#161b22] p-4 rounded-[6px] border border-gray-800">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por ID (IMP-...), Cliente ou Rastreio..."
            className="w-full bg-[#0d1117] border border-gray-700 rounded-[4px] pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-[#f20606] focus:outline-none"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          {['Todos', 'Pendente', 'Em separação', 'Enviado', 'Entregue', 'Cancelado'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-[4px] text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === status
                  ? 'bg-[#f20606] text-white shadow-xs'
                  : 'bg-[#0d1117] text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-[#161b22] border border-gray-800 rounded-[6px] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#0d1117] text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-800">
              <tr>
                <th className="py-3.5 px-4 font-bold">Pedido</th>
                <th className="py-3.5 px-4 font-bold">Cliente</th>
                <th className="py-3.5 px-4 font-bold">Data</th>
                <th className="py-3.5 px-4 font-bold">Total</th>
                <th className="py-3.5 px-4 font-bold">Pagamento</th>
                <th className="py-3.5 px-4 font-bold">Status do Pedido</th>
                <th className="py-3.5 px-4 font-bold">Rastreio</th>
                <th className="py-3.5 px-4 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    Nenhum pedido encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG['Pendente'];
                  const Icon = statusInfo.icon;

                  return (
                    <tr key={order.id} className="hover:bg-gray-800/30 transition-colors">
                      
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-white whitespace-nowrap">
                        {order.id}
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-semibold text-white">{order.customerName || 'Cliente'}</p>
                        <p className="text-[11px] text-gray-400">{order.customerEmail}</p>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-gray-400">
                        {order.date}
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 font-bold text-[#f20606] whitespace-nowrap">
                        {formatPrice(order.total)}
                      </td>

                      {/* Payment */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-[11px] font-mono bg-gray-800 px-2 py-0.5 rounded text-gray-300">
                          {order.paymentMethod || 'PIX'}
                        </span>
                      </td>

                      {/* Status Selector Dropdown */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`text-[11px] font-bold rounded px-2.5 py-1 border cursor-pointer focus:outline-none ${statusInfo.bg}`}
                        >
                          <option value="Pendente" className="bg-[#161b22] text-amber-300">🟡 Pendente</option>
                          <option value="Em separação" className="bg-[#161b22] text-blue-300">🔵 Em separação</option>
                          <option value="Enviado" className="bg-[#161b22] text-purple-300">🟣 Enviado</option>
                          <option value="Entregue" className="bg-[#161b22] text-green-300">🟢 Entregue</option>
                          <option value="Cancelado" className="bg-[#161b22] text-red-300">🔴 Cancelado</option>
                        </select>
                      </td>

                      {/* Tracking Code */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {editingTrackingId === order.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={trackingInput}
                              onChange={(e) => setTrackingInput(e.target.value)}
                              placeholder="BR123456789AA"
                              className="w-28 bg-[#0d1117] border border-gray-700 rounded px-2 py-1 text-[11px] text-white font-mono focus:border-red-500 focus:outline-none"
                            />
                            <button
                              onClick={() => handleSaveTracking(order.id)}
                              className="px-2 py-1 bg-green-700 hover:bg-green-600 text-white rounded text-[10px] font-bold"
                            >
                              OK
                            </button>
                          </div>
                        ) : order.trackingCode ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-gray-200">{order.trackingCode}</span>
                            <button
                              onClick={() => {
                                setEditingTrackingId(order.id);
                                setTrackingInput(order.trackingCode);
                              }}
                              className="text-gray-500 hover:text-white p-1"
                              title="Editar rastreio"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingTrackingId(order.id);
                              setTrackingInput('');
                            }}
                            className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
                          >
                            + Adicionar
                          </button>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-gray-400 hover:text-white bg-gray-800/80 hover:bg-gray-700 rounded transition-colors inline-block cursor-pointer"
                          title="Ver detalhes do pedido"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Deseja excluir o pedido ${order.id}?`)) {
                              deleteOrder(order.id);
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-400 bg-gray-800/80 hover:bg-red-950 rounded transition-colors inline-block cursor-pointer"
                          title="Excluir pedido"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-gray-800 max-w-2xl w-full rounded-[6px] p-6 text-white shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-5">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase">Detalhes do Pedido</span>
                <h3 className="text-lg font-mono font-bold text-white">{selectedOrder.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#0d1117] p-4 rounded border border-gray-800/80 space-y-2 text-xs">
                <h4 className="font-bold text-gray-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#f20606]" />
                  Dados do Cliente
                </h4>
                <p><strong>Nome:</strong> {selectedOrder.customerName || 'Cliente'}</p>
                <p><strong>E-mail:</strong> {selectedOrder.customerEmail || 'Não informado'}</p>
                <p><strong>Telefone:</strong> {selectedOrder.customerPhone || 'Não informado'}</p>
              </div>

              <div className="bg-[#0d1117] p-4 rounded border border-gray-800/80 space-y-2 text-xs">
                <h4 className="font-bold text-gray-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#f20606]" />
                  Endereço de Entrega
                </h4>
                {selectedOrder.shippingAddress ? (
                  <>
                    <p>{selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.number} {selectedOrder.shippingAddress.complement ? `- ${selectedOrder.shippingAddress.complement}` : ''}</p>
                    <p>{selectedOrder.shippingAddress.neighborhood} - {selectedOrder.shippingAddress.city}/{selectedOrder.shippingAddress.state}</p>
                    <p className="font-mono text-gray-400">CEP: {selectedOrder.shippingAddress.cep}</p>
                  </>
                ) : (
                  <p className="text-gray-500">Endereço não cadastrado</p>
                )}
              </div>
            </div>

            {/* Items Breakdown */}
            <div className="mb-6">
              <h4 className="font-bold text-gray-300 uppercase tracking-wider text-xs mb-3">
                Itens Comprados
              </h4>
              <div className="space-y-2.5">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-[#0d1117] border border-gray-800 rounded">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-contain bg-white rounded p-1"
                      />
                    )}
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-bold text-white truncate">{item.name}</p>
                      <p className="text-[11px] text-gray-400">Qtd: {item.qty} {item.color ? `| Cor: ${item.color}` : ''}</p>
                    </div>
                    <span className="font-bold text-sm text-[#f20606]">
                      {formatPrice((item.price || 0) * (item.qty || 1))}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer Summary */}
            <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400">Total do Pedido:</span>
                <p className="text-xl font-extrabold text-[#f20606]">{formatPrice(selectedOrder.total)}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold px-5 py-2.5 rounded transition-colors"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
