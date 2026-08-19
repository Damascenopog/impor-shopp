import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Share2, Check, ArrowLeft, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { products } from '../data/products';
import { ProductGallery } from '../components/product/ProductGallery';
import { ShippingCalculator } from '../components/product/ShippingCalculator';
import { ProductGrid } from '../components/product/ProductGrid';
import { TruckIcon, WhatsAppIcon } from '../components/common/Icons';
import { formatPrice, calculateInstallments } from '../utils/formatters';
import { useCartStore } from '../store/useCartStore';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const product = products.find((p) => p.slug === slug) || products[0];

  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

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
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleBuy = () => {
    setIsAdding(true);
    addItem(product, quantity, selectedColor);
    setTimeout(() => {
      setIsAdding(false);
    }, 400);
  };

  const handleShare = (network) => {
    const url = window.location.href;
    const text = `Confira ${product.name} na Imporshopp!`;
    const shareUrls = {
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    };
    if (shareUrls[network]) {
      window.open(shareUrls[network], '_blank');
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

            {/* Colors / Variation selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-5 pt-3 border-t border-gray-100">
                <label className="block text-xs font-bold uppercase text-gray-700 mb-2">
                  Cor: <span className="text-black font-semibold">{selectedColor?.name}</span>
                </label>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all p-0.5 ${
                        selectedColor?.name === color.name
                          ? 'border-[#f20606] scale-110 shadow-xs'
                          : 'border-transparent hover:scale-105'
                      }`}
                      title={color.name}
                    >
                      <span
                        className="w-full h-full rounded-full block border border-gray-300"
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Buy Button */}
            <div className="flex items-center gap-3 mb-4">
              {/* Quantity Changer */}
              <div className="flex items-center border border-gray-300 rounded-[4px] bg-white h-12 shrink-0 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-full flex items-center justify-center text-gray-700 hover:bg-gray-100 font-bold text-base transition-colors select-none"
                  aria-label="Diminuir quantidade"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 text-center text-sm font-bold text-gray-900 border-x border-gray-300 h-full focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-full flex items-center justify-center text-gray-700 hover:bg-gray-100 font-bold text-base transition-colors select-none"
                  aria-label="Aumentar quantidade"
                >
                  +
                </button>
              </div>

              {/* Main Buy Button */}
              <button
                onClick={handleBuy}
                disabled={isAdding}
                className="flex-1 h-12 bg-[#f20606] hover:bg-[#d40505] text-white font-extrabold uppercase text-sm tracking-wider rounded-[4px] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isAdding ? 'Adicionando...' : 'Comprar'}</span>
              </button>
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
            <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Compartilhar:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                  title="Compartilhar no WhatsApp"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                  title="Compartilhar no Facebook"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>

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

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <ProductGrid
              title="Produtos Relacionados"
              subtitle="Quem viu este item também comprou"
              products={relatedProducts}
              columns={4}
            />
          </div>
        )}

      </div>
    </div>
  );
};
