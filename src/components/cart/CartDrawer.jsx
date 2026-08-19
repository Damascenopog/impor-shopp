import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { formatPrice, simulateShipping } from '../../utils/formatters';

export const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    shippingZip,
    shippingCost,
    shippingOption,
    setShipping,
    coupon,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscountAmount,
    getTotal
  } = useCartStore();

  const [inputZip, setInputZip] = useState(shippingZip || '');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingError, setShippingError] = useState('');
  
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState(null);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const total = getTotal();
  const freeShippingThreshold = 199;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleCalculateShipping = async (e) => {
    e.preventDefault();
    setShippingError('');
    if (!inputZip || inputZip.replace(/\D/g, '').length !== 8) {
      setShippingError('Digite um CEP válido com 8 dígitos.');
      return;
    }

    try {
      setIsCalculatingShipping(true);
      const results = await simulateShipping(inputZip, subtotal);
      setShippingOptions(results);
      // Auto-select the first / cheapest option
      if (results.length > 0) {
        setShipping(inputZip, results[0].price, results[0]);
      }
    } catch (err) {
      setShippingError(err.message || 'Erro ao calcular frete.');
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const result = applyCoupon(couponCode);
    setCouponMessage(result);
    setCouponCode('');
  };

  const handleGoToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-black text-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#f20606]" />
              <h2 className="font-bold text-sm sm:text-base uppercase tracking-wider">
                Meu Carrinho ({items.length})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Fechar Carrinho"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          {items.length > 0 && (
            <div className="bg-neutral-50 px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-gray-700 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#3fef09]" />
                  {remainingForFreeShipping === 0 ? (
                    <strong className="text-green-700">Parabéns! Você ganhou Frete Grátis!</strong>
                  ) : (
                    <span>
                      Faltam <strong>{formatPrice(remainingForFreeShipping)}</strong> para <strong>Frete Grátis</strong>
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-bold text-gray-500">
                  {Math.round(freeShippingProgress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#3fef09] h-full transition-all duration-500 ease-out"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List or Empty State */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-1">Seu carrinho está vazio</h3>
                <p className="text-xs text-gray-500 mb-6">
                  Explore nossos lançamentos e encontre os melhores eletrônicos.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/produtos');
                  }}
                  className="btn-primary w-full py-3 text-xs uppercase"
                >
                  Ver Produtos
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.product.id}-${item.colorName}`}
                  className="flex gap-3.5 pb-4 border-b border-gray-100 last:border-0"
                >
                  {/* Thumbnail */}
                  <Link
                    to={`/produtos/${item.product.slug}`}
                    onClick={closeCart}
                    className="w-20 h-20 shrink-0 bg-white border border-gray-100 rounded-[4px] p-1 flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-contain hover:scale-105 transition-transform"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/produtos/${item.product.slug}`}
                          onClick={closeCart}
                          className="text-xs font-semibold text-gray-800 hover:text-[#f20606] transition-colors line-clamp-2"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.product.id, item.colorName)}
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                          title="Remover item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.colorName && item.colorName !== 'Padrão' && (
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Cor: <span className="font-medium text-gray-700">{item.colorName}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Modifier */}
                      <div className="flex items-center border border-gray-200 rounded-[4px] bg-white">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.colorName, item.quantity - 1)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 transition-colors"
                          aria-label="Diminuir"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.colorName, item.quantity + 1)}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 transition-colors"
                          aria-label="Aumentar"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="text-xs font-bold text-gray-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Shipping Simulator inside Cart */}
            {items.length > 0 && (
              <div className="bg-gray-50 p-3.5 rounded-[4px] border border-gray-100 mt-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 mb-2">
                  <Truck className="w-4 h-4 text-gray-600" />
                  <span>Calcular Frete e Prazo</span>
                </div>

                <form onSubmit={handleCalculateShipping} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={9}
                    value={inputZip}
                    onChange={(e) => setInputZip(e.target.value)}
                    placeholder="Seu CEP (ex: 20000-000)"
                    className="flex-1 bg-white border border-gray-200 text-xs px-3 py-2 rounded-[4px] focus:border-black focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isCalculatingShipping}
                    className="bg-black hover:bg-gray-800 text-white font-bold text-xs px-3.5 py-2 rounded-[4px] transition-colors"
                  >
                    {isCalculatingShipping ? 'Calculando...' : 'Calcular'}
                  </button>
                </form>

                {shippingError && (
                  <p className="text-[11px] text-red-600 mt-1.5">{shippingError}</p>
                )}

                {/* Shipping Results list */}
                {shippingOptions.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {shippingOptions.map((opt) => (
                      <label
                        key={opt.id}
                        onClick={() => setShipping(inputZip, opt.price, opt)}
                        className={`flex items-center justify-between p-2 rounded text-xs cursor-pointer border transition-colors ${
                          shippingOption?.id === opt.id
                            ? 'bg-red-50/60 border-[#f20606] text-gray-900 font-medium'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="cart_shipping"
                            checked={shippingOption?.id === opt.id}
                            onChange={() => {}}
                            className="text-[#f20606] focus:ring-0"
                          />
                          <div>
                            <p className="font-semibold">{opt.name}</p>
                            <p className="text-[10px] text-gray-500">{opt.days}</p>
                          </div>
                        </div>
                        <span className="font-bold text-gray-900">
                          {opt.isFree ? (
                            <span className="text-green-600 uppercase font-bold">Grátis</span>
                          ) : (
                            formatPrice(opt.price)
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Coupon field */}
            {items.length > 0 && (
              <div className="bg-gray-50 p-3.5 rounded-[4px] border border-gray-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 mb-2">
                  <Tag className="w-4 h-4 text-gray-600" />
                  <span>Cupom de Desconto</span>
                </div>

                {coupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 p-2 rounded text-xs">
                    <span className="text-green-800 font-bold">
                      Cupom {coupon.code} aplicado
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-red-600 hover:underline font-semibold"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Código do cupom (ex: IMPOR10)"
                      className="flex-1 bg-white border border-gray-200 text-xs px-3 py-2 rounded-[4px] uppercase focus:border-black focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-neutral-800 hover:bg-neutral-900 text-white font-bold text-xs px-3 py-2 rounded-[4px] transition-colors"
                    >
                      Aplicar
                    </button>
                  </form>
                )}

                {couponMessage && (
                  <p className={`text-[11px] mt-1.5 ${couponMessage.success ? 'text-green-600' : 'text-red-600'}`}>
                    {couponMessage.message}
                  </p>
                )}
              </div>
            )}

          </div>

          {/* Cart Footer / Checkout Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-gray-200 shadow-lg space-y-3">
              
              {/* Summary Rows */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Desconto ({coupon?.code})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Frete</span>
                  <span className="font-semibold text-gray-800">
                    {shippingOption
                      ? shippingOption.isFree
                        ? 'Grátis'
                        : formatPrice(shippingCost)
                      : 'A calcular'}
                  </span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-[#f20606] text-lg">{formatPrice(total)}</span>
                </div>

                <p className="text-[11px] text-gray-500 text-right">
                  Ou até 12x de {formatPrice(total / 12)}
                </p>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={handleGoToCheckout}
                className="w-full bg-[#f20606] hover:bg-[#d40505] text-white font-extrabold py-3.5 px-4 rounded-[4px] uppercase text-sm tracking-wider shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Iniciar Compra</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={closeCart}
                className="w-full text-center text-xs text-gray-500 hover:text-black font-medium transition-colors pt-1"
              >
                Ver mais produtos
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
