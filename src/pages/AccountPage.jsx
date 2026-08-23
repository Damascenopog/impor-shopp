import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Package, 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  Phone, 
  Mail, 
  CreditCard,
  Truck,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { formatPrice } from '../utils/formatters';

export const AccountPage = ({ defaultTab }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated, logout, updateProfile, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuthStore();

  const tabFromUrl = searchParams.get('tab') || defaultTab || 'profile';
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    cpf: user?.cpf || '',
    birthDate: user?.birthDate || '',
    gender: user?.gender || 'Não informado',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profileSuccessMessage, setProfileSuccessMessage] = useState('');
  const [profileErrorMessage, setProfileErrorMessage] = useState('');

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    label: 'Casa',
    recipient: user?.name || '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: 'RJ',
    isDefault: false
  });
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [addressSuccessMessage, setAddressSuccessMessage] = useState('');

  // Sync state if user changes
  useEffect(() => {
    if (user) {
      setProfileForm((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        cpf: user.cpf || '',
        birthDate: user.birthDate || '',
        gender: user.gender || 'Não informado'
      }));
    }
  }, [user]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 text-[#f20606] rounded-full flex items-center justify-center mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
        <p className="text-xs text-gray-600 mb-6 max-w-sm">
          Você precisa estar conectado à sua conta para visualizar e alterar seus dados ou endereços.
        </p>
        <Link to="/account/login" className="btn-primary text-xs uppercase px-8 py-3">
          Iniciar Sessão
        </Link>
      </div>
    );
  }

  // Profile submission handler
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfileErrorMessage('');
    setProfileSuccessMessage('');

    if (!profileForm.name || !profileForm.email) {
      setProfileErrorMessage('Nome e E-mail são obrigatórios.');
      return;
    }

    if (profileForm.newPassword) {
      if (profileForm.newPassword.length < 6) {
        setProfileErrorMessage('A nova senha deve ter no mínimo 6 caracteres.');
        return;
      }
      if (profileForm.newPassword !== profileForm.confirmPassword) {
        setProfileErrorMessage('As senhas digitadas não coincidem.');
        return;
      }
    }

    updateProfile({
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
      cpf: profileForm.cpf,
      birthDate: profileForm.birthDate,
      gender: profileForm.gender
    });

    setProfileSuccessMessage('Informações da conta atualizadas com sucesso!');
    setProfileForm((prev) => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    setTimeout(() => setProfileSuccessMessage(''), 4000);
  };

  // CEP auto-fill handler (ViaCEP)
  const handleCepLookup = async (cepValue) => {
    const cleanCep = cepValue.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setIsSearchingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setAddressForm((prev) => ({
            ...prev,
            street: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || ''
          }));
        }
      } catch (err) {
        console.error('Erro ao consultar CEP:', err);
      } finally {
        setIsSearchingCep(false);
      }
    }
  };

  // Address Modal Open
  const openNewAddressModal = () => {
    setEditingAddressId(null);
    setAddressForm({
      label: 'Casa',
      recipient: user?.name || '',
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: 'RJ',
      isDefault: !user.addresses || user.addresses.length === 0
    });
    setIsAddressModalOpen(true);
  };

  const openEditAddressModal = (address) => {
    setEditingAddressId(address.id);
    setAddressForm({
      label: address.label || 'Casa',
      recipient: address.recipient || user?.name || '',
      cep: address.cep || '',
      street: address.street || '',
      number: address.number || '',
      complement: address.complement || '',
      neighborhood: address.neighborhood || '',
      city: address.city || '',
      state: address.state || 'RJ',
      isDefault: address.isDefault || false
    });
    setIsAddressModalOpen(true);
  };

  // Address submit handler
  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!addressForm.cep || !addressForm.street || !addressForm.number || !addressForm.city) {
      alert('Por favor, preencha os campos obrigatórios do endereço.');
      return;
    }

    if (editingAddressId) {
      updateAddress(editingAddressId, addressForm);
      setAddressSuccessMessage('Endereço atualizado com sucesso!');
    } else {
      addAddress(addressForm);
      setAddressSuccessMessage('Novo endereço adicionado com sucesso!');
    }

    setIsAddressModalOpen(false);
    setTimeout(() => setAddressSuccessMessage(''), 4000);
  };

  return (
    <div className="min-h-screen bg-[#ecf0f1] pb-16">
      
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-gray-200 py-3 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-black transition-colors">Início</Link>
          <span>&gt;</span>
          <span className="text-gray-900 font-semibold">Minha Conta</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
        
        {/* User Greeting Bar */}
        <div className="bg-black text-white p-5 sm:p-6 rounded-[4px] shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#f20606] text-white flex items-center justify-center text-xl font-bold uppercase shadow-inner">
              {user.name.charAt(0)}
            </div>
            <div>
              <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Bem-vindo(a) de volta</span>
              <h1 className="text-lg sm:text-xl font-extrabold text-white">{user.name}</h1>
              <p className="text-xs text-gray-300 font-mono">{user.email}</p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-700 hover:border-red-500 hover:text-red-500 text-xs font-semibold rounded-[4px] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair da Conta</span>
          </button>
        </div>

        {/* 2-Columns Account Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-4 bg-white rounded-[4px] border border-gray-200 p-2 sm:p-3 shadow-xs space-y-1">
            <button
              onClick={() => handleTabChange('profile')}
              className={`w-full flex items-center justify-between px-4 py-3 text-xs sm:text-sm font-bold uppercase rounded-[4px] transition-colors ${
                activeTab === 'profile'
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <User className={`w-4 h-4 ${activeTab === 'profile' ? 'text-[#f20606]' : 'text-gray-400'}`} />
                <span>Meus Dados</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            <button
              onClick={() => handleTabChange('addresses')}
              className={`w-full flex items-center justify-between px-4 py-3 text-xs sm:text-sm font-bold uppercase rounded-[4px] transition-colors ${
                activeTab === 'addresses'
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin className={`w-4 h-4 ${activeTab === 'addresses' ? 'text-[#f20606]' : 'text-gray-400'}`} />
                <span>Endereços de Entrega</span>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                activeTab === 'addresses' ? 'bg-neutral-800 text-white' : 'bg-gray-100 text-gray-700'
              }`}>
                {user.addresses?.length || 0}
              </span>
            </button>

            <button
              onClick={() => handleTabChange('orders')}
              className={`w-full flex items-center justify-between px-4 py-3 text-xs sm:text-sm font-bold uppercase rounded-[4px] transition-colors ${
                activeTab === 'orders'
                  ? 'bg-black text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className={`w-4 h-4 ${activeTab === 'orders' ? 'text-[#f20606]' : 'text-gray-400'}`} />
                <span>Meus Pedidos</span>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                activeTab === 'orders' ? 'bg-neutral-800 text-white' : 'bg-gray-100 text-gray-700'
              }`}>
                {user.orders?.length || 0}
              </span>
            </button>
          </div>

          {/* Main Tab Content */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Tab 1: Profile & Personal Data */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-[4px] border border-gray-200 p-6 sm:p-8 shadow-xs animate-in fade-in">
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#f20606]" />
                    Informações Pessoais
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Atualize seus dados de cadastro e credenciais de acesso.
                  </p>
                </div>

                {profileSuccessMessage && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 text-xs font-semibold rounded-[4px] flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    <span>{profileSuccessMessage}</span>
                  </div>
                )}

                {profileErrorMessage && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-[4px] flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{profileErrorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-5">
                  
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded-[4px] px-3.5 py-2.5 text-xs text-gray-900 focus:border-black focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        required
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded-[4px] px-3.5 py-2.5 text-xs text-gray-900 focus:border-black focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Telefone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="(21) 97289-3879"
                        className="w-full bg-white border border-gray-300 rounded-[4px] px-3.5 py-2.5 text-xs text-gray-900 focus:border-black focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        CPF
                      </label>
                      <input
                        type="text"
                        value={profileForm.cpf}
                        onChange={(e) => setProfileForm({ ...profileForm, cpf: e.target.value })}
                        placeholder="000.000.000-00"
                        className="w-full bg-white border border-gray-300 rounded-[4px] px-3.5 py-2.5 text-xs text-gray-900 focus:border-black focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Data de Nascimento
                      </label>
                      <input
                        type="date"
                        value={profileForm.birthDate}
                        onChange={(e) => setProfileForm({ ...profileForm, birthDate: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded-[4px] px-3.5 py-2.5 text-xs text-gray-900 focus:border-black focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Password Change Block */}
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-800 mb-3">
                      Alterar Senha de Acesso (Opcional)
                    </h3>
                    <p className="text-[11px] text-gray-500 mb-4">
                      Deixe em branco caso não queira alterar sua senha atual.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                          Nova Senha
                        </label>
                        <input
                          type="password"
                          value={profileForm.newPassword}
                          onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                          placeholder="Mínimo de 6 caracteres"
                          className="w-full bg-white border border-gray-300 rounded-[4px] px-3.5 py-2.5 text-xs text-gray-900 focus:border-black focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                          Confirmar Nova Senha
                        </label>
                        <input
                          type="password"
                          value={profileForm.confirmPassword}
                          onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                          placeholder="Repita a nova senha"
                          className="w-full bg-white border border-gray-300 rounded-[4px] px-3.5 py-2.5 text-xs text-gray-900 focus:border-black focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="btn-primary text-xs uppercase px-8 py-3 shadow-md"
                    >
                      Salvar Alterações
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* Tab 2: Addresses Management */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-[4px] border border-gray-200 p-6 sm:p-8 shadow-xs animate-in fade-in">
                <div className="border-b border-gray-100 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-gray-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#f20606]" />
                      Endereços de Entrega
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Gerencie seus endereços para agilizar suas compras na finalização do pedido.
                    </p>
                  </div>

                  <button
                    onClick={openNewAddressModal}
                    className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-[4px] transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#3fef09]" />
                    <span>Adicionar Endereço</span>
                  </button>
                </div>

                {addressSuccessMessage && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 text-xs font-semibold rounded-[4px] flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    <span>{addressSuccessMessage}</span>
                  </div>
                )}

                {/* Addresses Grid */}
                {(!user.addresses || user.addresses.length === 0) ? (
                  <div className="text-center py-12 px-4 border border-dashed border-gray-200 rounded-[4px] bg-gray-50/50">
                    <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-gray-800 uppercase mb-1">Nenhum endereço cadastrado</h3>
                    <p className="text-xs text-gray-500 mb-4 max-w-sm mx-auto">
                      Cadastre seu endereço residencial ou comercial para calcular o frete com precisão.
                    </p>
                    <button
                      onClick={openNewAddressModal}
                      className="btn-primary text-xs uppercase px-6 py-2.5"
                    >
                      Cadastrar Primeiro Endereço
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-5 rounded-[4px] border transition-all relative ${
                          addr.isDefault
                            ? 'border-[#f20606] bg-red-50/10 shadow-xs'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        {/* Header of Address Card */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#f20606]" />
                            {addr.label || 'Endereço'}
                          </span>

                          {addr.isDefault ? (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-[#f20606] px-2 py-0.5 rounded-[2px]">
                              Principal
                            </span>
                          ) : (
                            <button
                              onClick={() => setDefaultAddress(addr.id)}
                              className="text-[11px] text-gray-500 hover:text-black hover:underline font-medium cursor-pointer"
                            >
                              Tornar Principal
                            </button>
                          )}
                        </div>

                        {/* Recipient and Address info */}
                        <div className="text-xs text-gray-600 space-y-1 mb-4 leading-relaxed">
                          <p className="font-semibold text-gray-800">Destinatário: {addr.recipient}</p>
                          <p>{addr.street}, {addr.number} {addr.complement ? `- ${addr.complement}` : ''}</p>
                          <p>{addr.neighborhood} - {addr.city} / {addr.state}</p>
                          <p className="font-mono text-gray-500 font-medium">CEP: {addr.cep}</p>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditAddressModal(addr)}
                            className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                            title="Editar endereço"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              if (window.confirm('Tem certeza que deseja remover este endereço?')) {
                                deleteAddress(addr.id);
                              }
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                            title="Excluir endereço"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Excluir</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Orders History */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-[4px] border border-gray-200 p-6 sm:p-8 shadow-xs animate-in fade-in">
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#f20606]" />
                    Meus Pedidos
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Acompanhe o status de entrega e histórico das suas compras.
                  </p>
                </div>

                {(!user.orders || user.orders.length === 0) ? (
                  <div className="text-center py-12 px-4 border border-dashed border-gray-200 rounded-[4px] bg-gray-50/50">
                    <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-gray-800 uppercase mb-1">Nenhum pedido realizado ainda</h3>
                    <p className="text-xs text-gray-500 mb-4 max-w-sm mx-auto">
                      Explore nosso catálogo e aproveite as melhores ofertas em eletrônicos e acessórios!
                    </p>
                    <Link to="/produtos" className="btn-primary text-xs uppercase px-6 py-2.5">
                      Explorar Produtos
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {user.orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-[4px] p-5 hover:border-gray-300 transition-all bg-white"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
                          <div>
                            <span className="text-[11px] font-bold text-gray-400 uppercase">Pedido</span>
                            <h4 className="font-bold text-sm font-mono text-gray-900">{order.id}</h4>
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-gray-400 uppercase">Data</span>
                            <p className="text-xs font-semibold text-gray-700">{order.date}</p>
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-gray-400 uppercase">Total</span>
                            <p className="text-xs font-extrabold text-[#f20606]">{formatPrice(order.total)}</p>
                          </div>
                          <div>
                            <span className={`inline-block text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-[2px] ${
                              order.status === 'Entregue'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'Em trânsito'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="py-3 space-y-2">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-xs">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-10 h-10 object-contain border border-gray-100 rounded p-1 bg-white"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-800 truncate">{item.name || item}</p>
                                {item.qty && (
                                  <p className="text-[11px] text-gray-500">Qtd: {item.qty} {item.color ? `| Cor: ${item.color}` : ''}</p>
                                )}
                              </div>
                              {item.price && (
                                <span className="font-bold text-gray-900">{formatPrice(item.price * (item.qty || 1))}</span>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Tracking info */}
                        {order.trackingCode && (
                          <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-600 gap-2">
                            <span className="flex items-center gap-1.5">
                              <Truck className="w-3.5 h-3.5 text-green-600" />
                              Código de Rastreio: <strong className="font-mono text-black">{order.trackingCode}</strong>
                            </span>
                            <a
                              href={`https://rastreamento.correios.com.br/app/index.php?codigo=${order.trackingCode}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#f20606] hover:underline font-bold flex items-center gap-1"
                            >
                              <span>Rastrear no site dos Correios</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Address Add / Edit Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-[4px] p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-extrabold text-sm sm:text-base text-gray-900 uppercase tracking-wide flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#f20606]" />
                {editingAddressId ? 'Editar Endereço' : 'Adicionar Novo Endereço'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="text-gray-400 hover:text-black font-bold text-base p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddressSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Identificação (ex: Casa, Trabalho) *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.label}
                    onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                    placeholder="ex.: Casa"
                    className="w-full bg-white border border-gray-300 rounded-[4px] p-2.5 text-xs text-gray-900 focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Nome do Destinatário *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.recipient}
                    onChange={(e) => setAddressForm({ ...addressForm, recipient: e.target.value })}
                    placeholder="Quem vai receber"
                    className="w-full bg-white border border-gray-300 rounded-[4px] p-2.5 text-xs text-gray-900 focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              {/* CEP */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    CEP *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={addressForm.cep}
                      onChange={(e) => {
                        setAddressForm({ ...addressForm, cep: e.target.value });
                        handleCepLookup(e.target.value);
                      }}
                      placeholder="00000-000"
                      maxLength={9}
                      className="w-full bg-white border border-gray-300 rounded-[4px] p-2.5 text-xs text-gray-900 focus:border-black focus:outline-none font-mono"
                    />
                    {isSearchingCep && (
                      <span className="absolute right-2 top-2.5 text-[10px] text-gray-400 animate-pulse">
                        Buscando...
                      </span>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Logradouro / Rua *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                    placeholder="Rua, Avenida, Travessa..."
                    className="w-full bg-white border border-gray-300 rounded-[4px] p-2.5 text-xs text-gray-900 focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Número *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.number}
                    onChange={(e) => setAddressForm({ ...addressForm, number: e.target.value })}
                    placeholder="123"
                    className="w-full bg-white border border-gray-300 rounded-[4px] p-2.5 text-xs text-gray-900 focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Complemento
                  </label>
                  <input
                    type="text"
                    value={addressForm.complement}
                    onChange={(e) => setAddressForm({ ...addressForm, complement: e.target.value })}
                    placeholder="Apto, Bloco..."
                    className="w-full bg-white border border-gray-300 rounded-[4px] p-2.5 text-xs text-gray-900 focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.neighborhood}
                    onChange={(e) => setAddressForm({ ...addressForm, neighborhood: e.target.value })}
                    placeholder="Bairro"
                    className="w-full bg-white border border-gray-300 rounded-[4px] p-2.5 text-xs text-gray-900 focus:border-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Cidade / UF *
                  </label>
                  <input
                    type="text"
                    required
                    value={`${addressForm.city} - ${addressForm.state}`}
                    onChange={(e) => {
                      const parts = e.target.value.split('-');
                      setAddressForm({
                        ...addressForm,
                        city: parts[0]?.trim() || '',
                        state: parts[1]?.trim() || 'RJ'
                      });
                    }}
                    placeholder="Rio de Janeiro - RJ"
                    className="w-full bg-white border border-gray-300 rounded-[4px] p-2.5 text-xs text-gray-900 focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              {/* Checkbox Default Address */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 font-medium">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    className="rounded text-[#f20606] focus:ring-[#f20606] h-4 w-4"
                  />
                  <span>Definir como meu endereço principal de entrega</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-[4px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs uppercase px-6 py-2.5"
                >
                  {editingAddressId ? 'Salvar Alterações' : 'Cadastrar Endereço'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
