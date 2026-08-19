import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, CheckCircle2, CreditCard, QrCode, FileText, ArrowLeft, Truck, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { formatPrice } from '../utils/formatters';

export const CheckoutPreviewPage = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, getDiscountAmount, getTotal, shippingCost, shippingOption, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const total = getTotal();

  const [step, setStep] = useState(1); // 1: Identificação, 2: Entrega, 3: Pagamento, 4: Sucesso
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    cpf: '',
    phone: user?.phone || '',
    cep: '20040-002',
    street: 'Avenida Rio Branco',
    number: '156',
    complement: 'Sala 102',
    neighborhood: 'Centro',
    city: 'Rio de Janeiro',
    state: 'RJ',
    paymentMethod: 'pix'
  });

  const [orderNumber, setOrderNumber] = useState('');

  if (items.length === 0 && step !== 4) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold mb-2">Seu carrinho está vazio</h2>
        <p className="text-xs text-gray-500 mb-6">Adicione itens para prosseguir para o checkout.</p>
        <Link to="/produtos" className="btn-primary">
          Ver Produtos
        </Link>
      </div>
    );
  }

  const handleFinishOrder = (e) => {
    e.preventDefault();
    const generatedOrder = `IMP-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(generatedOrder);
    setStep(4);
    clearCart();
    
    // Trigger celebration confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      
      {/* Checkout Header */}
      <header className="bg-black text-white border-b border-neutral-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 font-extrabold text-xl tracking-wider uppercase">
            IMPOR<span className="text-[#f20606]">SHOPP</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-gray-300 font-semibold">
            <Lock className="w-4 h-4 text-[#3fef09]" />
            <span>Ambiente 100% Seguro</span>
          </div>
        </div>
      </header>

      {/* Checkout Progress Stepper */}
      {step < 4 && (
        <div className="bg-white border-b border-gray-200 py-3">
          <div className="max-w-4xl mx-auto px-4 flex items-center justify-center gap-4 sm:gap-8 text-xs font-bold uppercase tracking-wider">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#f20606]' : 'text-gray-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-[#f20606] text-white' : 'bg-gray-200'}`}>1</span>
              <span>Identificação</span>
            </div>
            <span className="text-gray-300">---</span>
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#f20606]' : 'text-gray-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-[#f20606] text-white' : 'bg-gray-200'}`}>2</span>
              <span>Entrega</span>
            </div>
            <span className="text-gray-300">---</span>
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#f20606]' : 'text-gray-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-[#f20606] text-white' : 'bg-gray-200'}`}>3</span>
              <span>Pagamento</span>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {step === 4 ? (
          /* Order Confirmation / Success View */
          <div className="max-w-2xl mx-auto bg-white rounded-[6px] border border-gray-100 p-8 sm:p-12 text-center shadow-lg animate-in zoom-in-95">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="inline-block bg-green-100 text-green-800 text-xs font-extrabold uppercase px-3 py-1 rounded-[2px] mb-2 tracking-wider">
              Pedido Recebido com Sucesso!
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
              Obrigado por comprar na Imporshopp!
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mb-6">
              Número do Pedido: <strong className="text-black font-mono text-base">{orderNumber}</strong>
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-[4px] p-5 text-left text-xs space-y-2 mb-6">
              <p><strong>Status:</strong> Aguardando confirmação do gateway</p>
              <p><strong>Destinatário:</strong> {formData.name || 'Cliente Imporshopp'}</p>
              <p><strong>Endereço de Entrega:</strong> {formData.street}, {formData.number} - {formData.city}/{formData.state}</p>
              <p><strong>Forma de Pagamento:</strong> {formData.paymentMethod.toUpperCase()}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/" className="btn-primary text-xs uppercase px-8 py-3.5">
                Continuar Comprando
              </Link>
            </div>
          </div>
        ) : (
          /* 2 Columns: Form on Left, Order Summary on Right */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Steps Form Area */}
            <div className="lg:col-span-7 bg-white rounded-[4px] border border-gray-100 p-6 sm:p-8 shadow-xs">
              
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <h2 className="text-base font-bold uppercase tracking-wider text-gray-900 pb-2 border-b border-gray-100">
                    Passo 1: Dados Pessoais & Contato
                  </h2>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      E-mail para envio do rastreio *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="seuemail@email.com.br"
                      className="w-full bg-white border border-gray-300 rounded-[4px] p-2.5 text-xs text-gray-900 focus:border-black focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nome e Sobrenome"
                      className="w-full bg-white border border-gray-300 rounded-[4px] p-2.5 text-xs text-gray-900 focus:border-black focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        CPF *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.cpf}
                        onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                        placeholder="000.000.000-00"
                        className="w-full bg-white border border-gray-300 rounded-[4px] p-2.5 text-xs text-gray-900 focus:border-black focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Telefone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(21) 97289-3879"
                        className="w-full bg-white border border-gray-300 rounded-[4px] p-2.5 text-xs text-gray-900 focus:border-black focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-primary w-full py-3 text-xs uppercase tracking-wider mt-4"
                  >
                    Prosseguir para Entrega
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <h2 className="text-base font-bold uppercase tracking-wider text-gray-900">
                      Passo 2: Endereço de Entrega
                    </h2>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-gray-500 hover:text-black font-semibold"
                    >
                      Voltar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        CEP *
                      </label>
                      <input
                        type="text"
                        value={formData.cep}
                        onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded-[4px] p-2.5 text-xs text-gray-900 focus:border-black focus:outline-none font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Logradouro / Rua *
                      </label>
                      <input
                        type="text"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded-[4px] p-2.5 text-xs text-gray-900 focus:border-black focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Número *
                      </label>
                      <input
                        type="text"
                        value={formData.number}
                        onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded-[4px] p-2.5 text-xs text-gray-900 focus:border-black focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Complemento
                      </label>
                      <input
                        type="text"
                        value={formData.complement}
                        onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded-[4px] p-2.5 text-xs text-gray-900 focus:border-black focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Bairro *
                      </label>
                      <input
                        type="text"
                        value={formData.neighborhood}
                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded-[4px] p-2.5 text-xs text-gray-900 focus:border-black focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Cidade / UF *
                      </label>
                      <input
                        type="text"
                        value={`${formData.city} - ${formData.state}`}
                        readOnly
                        className="w-full bg-gray-100 border border-gray-300 rounded-[4px] p-2.5 text-xs text-gray-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="btn-primary w-full py-3 text-xs uppercase tracking-wider mt-4"
                  >
                    Prosseguir para Pagamento
                  </button>
                </div>
              )}

              {step === 3 && (
                <form onSubmit={handleFinishOrder} className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <h2 className="text-base font-bold uppercase tracking-wider text-gray-900">
                      Passo 3: Meio de Pagamento
                    </h2>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-xs text-gray-500 hover:text-black font-semibold"
                    >
                      Voltar
                    </button>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: 'pix' })}
                      className={`p-3 rounded-[4px] border text-center transition-all flex flex-col items-center gap-1.5 ${
                        formData.paymentMethod === 'pix'
                          ? 'border-[#3fef09] bg-green-50/50 text-green-900 font-bold ring-1 ring-[#3fef09]'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <QrCode className="w-5 h-5 text-green-600" />
                      <span className="text-xs">PIX (Instantâneo)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: 'credit_card' })}
                      className={`p-3 rounded-[4px] border text-center transition-all flex flex-col items-center gap-1.5 ${
                        formData.paymentMethod === 'credit_card'
                          ? 'border-[#f20606] bg-red-50/50 text-red-900 font-bold ring-1 ring-[#f20606]'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-[#f20606]" />
                      <span className="text-xs">Cartão de Crédito</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: 'boleto' })}
                      className={`p-3 rounded-[4px] border text-center transition-all flex flex-col items-center gap-1.5 ${
                        formData.paymentMethod === 'boleto'
                          ? 'border-black bg-gray-100 text-black font-bold ring-1 ring-black'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                      <span className="text-xs">Boleto Bancário</span>
                    </button>
                  </div>

                  {/* Pix Details */}
                  {formData.paymentMethod === 'pix' && (
                    <div className="bg-green-50/60 border border-green-200 rounded-[4px] p-4 text-xs space-y-2">
                      <p className="font-bold text-green-900">
                        Pague com PIX e tenha aprovação imediata do seu pedido!
                      </p>
                      <p className="text-gray-600">
                        Ao clicar em "Finalizar Pedido", geraremos o QR Code e o código Pix Copia e Cola para você efetuar o pagamento pelo app do seu banco.
                      </p>
                    </div>
                  )}

                  {/* Credit Card Details */}
                  {formData.paymentMethod === 'credit_card' && (
                    <div className="bg-gray-50 border border-gray-200 rounded-[4px] p-4 space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-gray-700 uppercase mb-1">Número do Cartão</label>
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          className="w-full bg-white border border-gray-300 rounded p-2 text-xs font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-gray-700 uppercase mb-1">Validade</label>
                          <input
                            type="text"
                            placeholder="MM/AA"
                            className="w-full bg-white border border-gray-300 rounded p-2 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-gray-700 uppercase mb-1">CVV</label>
                          <input
                            type="text"
                            placeholder="123"
                            maxLength={4}
                            className="w-full bg-white border border-gray-300 rounded p-2 text-xs font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 uppercase mb-1">Parcelas</label>
                        <select className="w-full bg-white border border-gray-300 rounded p-2 text-xs font-medium">
                          <option>1x de {formatPrice(total)} sem juros</option>
                          <option>2x de {formatPrice(total / 2)} sem juros</option>
                          <option>3x de {formatPrice(total / 3)} sem juros</option>
                          <option>6x de {formatPrice(total / 6)} sem juros</option>
                          <option>12x de {formatPrice(total / 12)} sem juros</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Boleto Details */}
                  {formData.paymentMethod === 'boleto' && (
                    <div className="bg-gray-50 border border-gray-200 rounded-[4px] p-4 text-xs space-y-2">
                      <p className="font-bold text-gray-900">Boleto Bancário</p>
                      <p className="text-gray-600">
                        O boleto será emitido após a confirmação e pode ser pago em qualquer banco ou lotérica. A compensação leva de 1 a 2 dias úteis.
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[#f20606] hover:bg-[#d40505] text-white font-extrabold py-3.5 px-4 rounded-[4px] uppercase text-sm tracking-wider shadow-lg transition-colors mt-4"
                  >
                    Finalizar Pedido ({formatPrice(total)})
                  </button>
                </form>
              )}

            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-5 bg-white rounded-[4px] border border-gray-100 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#f20606]" />
                Resumo do Pedido ({items.length})
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.colorName}`} className="flex items-center gap-3 text-xs">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 object-contain bg-white border border-gray-100 rounded p-1"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 line-clamp-1">{item.product.name}</p>
                      <p className="text-gray-400 text-[11px]">Qtd: {item.quantity} | {item.colorName}</p>
                    </div>
                    <span className="font-bold text-gray-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-2 pt-3 border-t border-gray-100 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Desconto</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Frete</span>
                  <span className="font-semibold text-gray-800">
                    {shippingOption?.isFree || shippingCost === 0 ? 'Grátis' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-[#f20606] text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="pt-2 text-center text-[11px] text-gray-400">
                <p>Pagamento processado em ambiente seguro com criptografia TLS de 256 bits.</p>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
