import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Share2, Check, ArrowLeft, ShieldCheck, Truck, RefreshCw, Plus, Sparkles } from 'lucide-react';
import { products } from '../data/products';
import { ProductGallery } from '../components/product/ProductGallery';
import { ShippingCalculator } from '../components/product/ShippingCalculator';
import { ProductGrid } from '../components/product/ProductGrid';
import { TruckIcon, WhatsAppIcon } from '../components/common/Icons';
import { formatPrice, calculateInstallments } from '../utils/formatters';
import { getRecommendedProducts, getBundleRecommendation } from '../utils/recommendations';
import { useCartStore } from '../store/useCartStore';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const product = products.find((p) => p.slug === slug) || products[0];

  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingBundle, setIsAddingBundle] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold mb-4">Produto não encontrado</h2>
        <Link to="/produtos" className="btn-primary">
          Ver Catálogo
        </Link>
      </div>
    );
  }

  const installments = calculateInstallments(product.price, 12);
  
  // Intelligent recommendation engine results
  const recommendedProducts = getRecommendedProducts(product, products, 8);
  const bundleProduct = getBundleRecommendation(product, products);

  // Bundle pricing calculation (10% discount on the combo)
  const bundleTotalPrice = bundleProduct ? (product.price + bundleProduct.price) * 0.9 : 0;
  const bundleOriginalPrice = bundleProduct ? product.price + bundleProduct.price : 0;
  const bundleSavings = bundleOriginalPrice - bundleTotalPrice;

  const handleBuy = () => {
    setIsAdding(true);
    addItem(product, quantity, selectedColor);
    setTimeout(() => {
      setIsAdding(false);
    }, 400);
  };

  const handleBuyBundle = () => {
    if (!bundleProduct) return;
    setIsAddingBundle(true);
    addItem(product, 1, selectedColor);
    addItem(bundleProduct, 1, bundleProduct.colors?.[0] || null);
    setTimeout(() => {
      setIsAddingBundle(false);
    }, 400);
  };

  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = async (network) => {
    const url = window.location.href;
    const shareTitle = `${product.name} | Imporshopp`;
    const shareMessage = `Confira esse produto na Imporshopp:\n\n*${product.name}*\nPor apenas *${formatPrice(product.price)}*\n\nVeja mais detalhes aqui: ${url}`;

    if (network === 'whatsapp') {
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    if (network === 'facebook') {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(facebookUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // Native Web Share or Copy Link
    if (network === 'native' || network === 'copy') {
      if (navigator.share) {
        try {
          await navigator.share({
            title: shareTitle,
            text: `Confira ${product.name} na Imporshopp por ${formatPrice(product.price)}!`,
            url: url
          });
          return;
        } catch (err) {
          if (err.name !== 'AbortError') {
            console.error('Erro ao compartilhar:', err);
          }
        }
      }

      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareMessage);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = shareMessage;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
      }
    }
  };

  return (
    <div className="min-h-screen pb-16">
      
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-gray-100 py-3 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-gray-500 overflow-x-auto whitespace-nowrap no-scrollbar">
          <Link to="/" className="hover:text-black transition-colors">Início</Link>
          <span>&gt;</span>
          <Link to={`/${product.category}`} className="hover:text-black transition-colors">
            {product.categoryName}
          </Link>
          <span>&gt;</span>
          <span className="text-gray-900 font-semibold truncate">{product.name}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column: Buying Details & Form */}
          <div className="lg:col-span-5 bg-white rounded-[4px] border border-gray-100 p-5 sm:p-7 shadow-xs">
            
            {/* Badges */}
            <div className="flex items-center gap-2 mb-2">
              {product.discountPercentage > 0 && (
                <span className="badge-offer">
                  -{product.discountPercentage}% OFF
                </span>
              )}
              {product.freeShipping && (
                <span className="badge-free-shipping">
                  <TruckIcon className="w-3.5 h-3.5" />
                  <span>Frete Grátis</span>
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug mb-3">
              {product.name}
            </h1>

            {/* Brand / Ref */}
            <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 pb-3 border-b border-gray-100">
              <span>Marca: <strong className="text-gray-700">{product.brand}</strong></span>
              <span>Código: <span className="font-mono">{product.id}</span></span>
            </div>

            {/* Pricing Area */}
            <div className="mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>

              {/* Installments note */}
              <p className="text-xs text-gray-600 mt-1 font-medium">
                Ou até <strong>12x de {formatPrice(installments.value)}</strong> sem juros
              </p>
            </div>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-5 pt-3 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                  Cor: <span className="text-gray-500 font-normal">{selectedColor?.name || 'Selecione'}</span>
                </label>
                <div className="flex items-center gap-2">
                  {product.colors.map((color, idx) => {
                    const isSelected = selectedColor?.name === color.name;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(color)}
                        className={`w-7 h-7 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                          isSelected
                            ? 'ring-2 ring-black ring-offset-2 scale-110'
                            : 'hover:scale-105 border border-gray-300'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {isSelected && (
                          <Check className={`w-3.5 h-3.5 ${color.hex === '#ffffff' || color.hex === '#d1d5db' ? 'text-black' : 'text-white'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector & Action Button */}
            <div className="space-y-3 mb-6 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-[4px] bg-white h-11">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-full flex items-center justify-center text-gray-600 hover:text-black font-bold text-sm disabled:opacity-30 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-xs text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-9 h-full flex items-center justify-center text-gray-600 hover:text-black font-bold text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleBuy}
                  disabled={isAdding}
                  className="btn-primary flex-1 h-11 text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isAdding ? 'Adicionando...' : 'Comprar Agora'}</span>
                </button>
              </div>
            </div>

            {/* Shipping Calculator */}
            <ShippingCalculator price={product.price * quantity} />

            {/* Trust and Guarantee badges */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2.5 text-xs text-gray-600">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Garantia de 30 dias com devolução facilitada</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4 text-blue-600" />
                <span>Troca grátis em caso de avaria ou defeito</span>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Compartilhar:
              </span>
              <div className="flex items-center gap-2">
                {/* WhatsApp Share Button */}
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#25D366] hover:bg-[#20bd5a] text-white transition-all text-xs font-bold shadow-xs cursor-pointer"
                  title="Compartilhar no WhatsApp"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
                  <span>WhatsApp</span>
                </button>

                {/* Normal Share / Copy Link Button */}
                <button
                  onClick={() => handleShare('native')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border transition-all text-xs font-bold shadow-xs cursor-pointer ${
                    copiedLink
                      ? 'bg-green-50 border-green-300 text-green-700'
                      : 'bg-white border-gray-300 hover:border-black text-gray-700 hover:text-black'
                  }`}
                  title="Compartilhar ou Copiar Link"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600 stroke-[3]" />
                      <span>Link Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-gray-600" />
                      <span>Compartilhar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Compre Junto / Bundle Combo Recommendation */}
        {bundleProduct && (
          <div className="mt-10 bg-white rounded-[4px] border border-gray-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
              <Sparkles className="w-5 h-5 text-[#f20606]" />
              <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-gray-900">
                Compre Junto e Economize 10%
              </h2>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              
              {/* Items in the combo */}
              <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
                
                {/* Product 1 */}
                <div className="flex items-center gap-3 p-3 border border-gray-100 rounded bg-gray-50/50 flex-1 w-full">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 object-contain bg-white rounded p-1 border border-gray-100 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase text-gray-400 block">Este produto</span>
                    <p className="text-xs font-bold text-gray-800 line-clamp-2">{product.name}</p>
                    <span className="text-xs font-extrabold text-[#f20606] mt-0.5 block">{formatPrice(product.price)}</span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold shrink-0">
                  <Plus className="w-4 h-4" />
                </div>

                {/* Product 2 */}
                <div className="flex items-center gap-3 p-3 border border-gray-100 rounded bg-gray-50/50 flex-1 w-full">
                  <img
                    src={bundleProduct.images[0]}
                    alt={bundleProduct.name}
                    className="w-16 h-16 object-contain bg-white rounded p-1 border border-gray-100 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase text-green-600 block">Recomendado</span>
                    <Link to={`/produtos/${bundleProduct.slug}`} className="text-xs font-bold text-gray-800 line-clamp-2 hover:text-[#f20606]">
                      {bundleProduct.name}
                    </Link>
                    <span className="text-xs font-extrabold text-[#f20606] mt-0.5 block">{formatPrice(bundleProduct.price)}</span>
                  </div>
                </div>

              </div>

              {/* Combo Price and Button */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-center lg:items-end justify-between gap-3 w-full lg:w-auto p-4 bg-gray-50 rounded border border-gray-100 shrink-0">
                <div>
                  <span className="text-xs text-gray-500 line-through block">
                    De {formatPrice(bundleOriginalPrice)}
                  </span>
                  <div className="text-lg font-black text-gray-900">
                    Por <span className="text-[#f20606]">{formatPrice(bundleTotalPrice)}</span>
                  </div>
                  <span className="text-[11px] font-bold text-green-600">
                    Economia de {formatPrice(bundleSavings)}
                  </span>
                </div>

                <button
                  onClick={handleBuyBundle}
                  disabled={isAddingBundle}
                  className="btn-primary text-xs uppercase px-6 py-3 tracking-wider shadow cursor-pointer whitespace-nowrap"
                >
                  {isAddingBundle ? 'Adicionando Combo...' : 'Comprar os 2 Juntos'}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Product Description and Specifications Tab */}
        <div className="mt-10 bg-white rounded-[4px] border border-gray-100 p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-[#f20606] rounded-full inline-block"></span>
            Descrição do Produto
          </h2>
          <div
            className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-3"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>

        {/* Related & Recommended Products Section */}
        {recommendedProducts.length > 0 && (
          <div className="mt-12">
            <ProductGrid
              title="Produtos Recomendados"
              subtitle={`Itens selecionados da mesma categoria (${product.categoryName}) e com alta afinidade`}
              products={recommendedProducts}
              columns={4}
            />
          </div>
        )}

      </div>
    </div>
  );
};
