import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Star, 
  Check, 
  ExternalLink, 
  Image as ImageIcon,
  Tag,
  DollarSign,
  Layers,
  AlertCircle
} from 'lucide-react';
import { useAdminStore } from '../../store/useAdminStore';
import { categories } from '../../data/categories';
import { formatPrice } from '../../utils/formatters';

export const AdminProductsTab = () => {
  const { products, addProduct, updateProduct, deleteProduct, toggleProductFeatured } = useAdminStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todos');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'caixas-de-som',
    categoryName: 'Caixas de som',
    brand: 'Altomex',
    price: '',
    comparePrice: '',
    stock: 10,
    freeShipping: true,
    isFeatured: false,
    isSale: false,
    imagesText: '',
    colorsText: 'Preto (#000000)',
    description: ''
  });

  const [formError, setFormError] = useState('');

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.includes(searchTerm);

    const matchesCategory = categoryFilter === 'todos' || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Open modal for new product
  const handleOpenNewModal = () => {
    setEditingProductId(null);
    setFormError('');
    setProductForm({
      name: '',
      category: 'caixas-de-som',
      categoryName: 'Caixas de som',
      brand: 'Altomex',
      price: '',
      comparePrice: '',
      stock: 10,
      freeShipping: true,
      isFeatured: false,
      isSale: false,
      imagesText: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80',
      colorsText: 'Preto (#000000), Azul (#1e3a8a)',
      description: 'Descrição do novo produto...'
    });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (product) => {
    setEditingProductId(product.id);
    setFormError('');
    
    const colorsFormatted = product.colors?.map((c) => `${c.name} (${c.hex})`).join(', ') || 'Preto (#000000)';
    const imagesFormatted = product.images?.join('\n') || '';

    setProductForm({
      name: product.name,
      category: product.category,
      categoryName: product.categoryName || product.category,
      brand: product.brand || 'Imporshopp',
      price: String(product.price),
      comparePrice: product.comparePrice ? String(product.comparePrice) : '',
      stock: product.stock !== undefined ? product.stock : 10,
      freeShipping: product.freeShipping ?? true,
      isFeatured: product.isFeatured ?? false,
      isSale: product.isSale ?? false,
      imagesText: imagesFormatted,
      colorsText: colorsFormatted,
      description: product.description || ''
    });
    setIsModalOpen(true);
  };

  // Submit Product Form
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!productForm.name || !productForm.price) {
      setFormError('Nome e Preço são obrigatórios.');
      return;
    }

    // Parse images array
    const images = productForm.imagesText
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    // Parse colors array (e.g. "Preto (#000000), Branco (#ffffff)")
    const colors = productForm.colorsText
      .split(',')
      .map((c) => {
        const match = c.match(/(.*?)\s*\((#[a-fA-F0-9]{3,6})\)/);
        if (match) {
          return { name: match[1].trim(), hex: match[2].trim(), inStock: true };
        }
        const nameOnly = c.trim();
        return { name: nameOnly || 'Padrão', hex: '#000000', inStock: true };
      })
      .filter((c) => c.name.length > 0);

    const categoryObj = categories.find((c) => c.slug === productForm.category);
    const categoryName = categoryObj ? categoryObj.name : productForm.category;

    const payload = {
      name: productForm.name,
      category: productForm.category,
      categoryName: categoryName,
      brand: productForm.brand,
      price: Number(productForm.price),
      comparePrice: productForm.comparePrice ? Number(productForm.comparePrice) : null,
      stock: Number(productForm.stock),
      freeShipping: productForm.freeShipping,
      isFeatured: productForm.isFeatured,
      isSale: productForm.isSale,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80'],
      colors: colors.length > 0 ? colors : [{ name: 'Preto', hex: '#000000', inStock: true }],
      description: productForm.description
    };

    if (editingProductId) {
      updateProduct(editingProductId, payload);
    } else {
      addProduct(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#161b22] p-4 rounded-[6px] border border-gray-800">
        
        {/* Search and Category Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-xl w-full">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por Nome, Marca ou Código..."
              className="w-full bg-[#0d1117] border border-gray-700 rounded-[4px] pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:border-[#f20606] focus:outline-none"
            />
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#0d1117] border border-gray-700 rounded-[4px] px-3 py-2 text-xs text-white focus:border-[#f20606] focus:outline-none cursor-pointer"
          >
            <option value="todos">Todas as Categorias</option>
            {categories.filter(c => c.slug !== 'produtos').map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Add Product CTA */}
        <button
          onClick={handleOpenNewModal}
          className="bg-[#f20606] hover:bg-[#d40505] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-[4px] shadow-md transition-all flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Produto</span>
        </button>

      </div>

      {/* Products Table */}
      <div className="bg-[#161b22] border border-gray-800 rounded-[6px] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#0d1117] text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-800">
              <tr>
                <th className="py-3.5 px-4 font-bold">Produto</th>
                <th className="py-3.5 px-4 font-bold">Categoria</th>
                <th className="py-3.5 px-4 font-bold">Marca</th>
                <th className="py-3.5 px-4 font-bold">Preço</th>
                <th className="py-3.5 px-4 font-bold">Estoque</th>
                <th className="py-3.5 px-4 font-bold text-center">Destaque</th>
                <th className="py-3.5 px-4 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    Nenhum produto cadastrado para essa busca.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-800/30 transition-colors">
                    
                    {/* Product Thumbnail & Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images?.[0]}
                          alt={product.name}
                          className="w-11 h-11 object-contain bg-white rounded p-1 border border-gray-800 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-white truncate">{product.name}</p>
                          <p className="text-[10px] font-mono text-gray-500">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-[11px] font-medium bg-gray-800 px-2 py-0.5 rounded text-gray-300">
                        {product.categoryName || product.category}
                      </span>
                    </td>

                    {/* Brand */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-gray-400">
                      {product.brand || '—'}
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-[#f20606]">{formatPrice(product.price)}</span>
                      {product.comparePrice && (
                        <span className="block text-[10px] text-gray-500 line-through">
                          {formatPrice(product.comparePrice)}
                        </span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        (product.stock || 0) > 5 ? 'bg-green-950/40 text-green-300' : 'bg-amber-950/40 text-amber-300'
                      }`}>
                        {product.stock ?? 10} un
                      </span>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => toggleProductFeatured(product.id)}
                        className={`p-1 rounded transition-colors cursor-pointer ${
                          product.isFeatured ? 'text-amber-400 hover:text-amber-300' : 'text-gray-600 hover:text-gray-400'
                        }`}
                        title={product.isFeatured ? 'Remover dos Destaques' : 'Destacar na Home'}
                      >
                        <Star className={`w-4 h-4 ${product.isFeatured ? 'fill-amber-400' : ''}`} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-1.5">
                      <a
                        href={`/produtos/${product.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-gray-400 hover:text-white bg-gray-800/80 hover:bg-gray-700 rounded transition-colors inline-block"
                        title="Visualizar na Loja"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="p-1.5 text-gray-400 hover:text-blue-400 bg-gray-800/80 hover:bg-blue-950 rounded transition-colors inline-block cursor-pointer"
                        title="Editar Produto"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Tem certeza que deseja remover o produto "${product.name}"?`)) {
                            deleteProduct(product.id);
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-400 bg-gray-800/80 hover:bg-red-950 rounded transition-colors inline-block cursor-pointer"
                        title="Excluir Produto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-gray-800 max-w-2xl w-full rounded-[6px] p-6 text-white shadow-2xl animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
              <h3 className="font-bold text-sm sm:text-base text-white uppercase tracking-wider flex items-center gap-2">
                <Package className="w-4 h-4 text-[#f20606]" />
                {editingProductId ? 'Editar Produto' : 'Cadastrar Novo Produto'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white font-bold text-base p-1"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-950/40 border border-red-800 rounded text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              
              {/* Name */}
              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="ex.: Caixa de Som Bluetooth Altomex"
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-[4px] p-2.5 text-xs text-white focus:border-[#f20606] focus:outline-none"
                />
              </div>

              {/* Category & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">
                    Categoria *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-[#0d1117] border border-gray-700 rounded-[4px] p-2.5 text-xs text-white focus:border-[#f20606] focus:outline-none"
                  >
                    {categories.filter(c => c.slug !== 'produtos').map((cat) => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">
                    Marca / Fabricante
                  </label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    placeholder="ex.: Altomex, Apple, Kapbom..."
                    className="w-full bg-[#0d1117] border border-gray-700 rounded-[4px] p-2.5 text-xs text-white focus:border-[#f20606] focus:outline-none"
                  />
                </div>
              </div>

              {/* Price, Compare Price, Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">
                    Preço de Venda (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="189.90"
                    className="w-full bg-[#0d1117] border border-gray-700 rounded-[4px] p-2.5 text-xs text-white focus:border-[#f20606] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">
                    Preço Original / De (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.comparePrice}
                    onChange={(e) => setProductForm({ ...productForm, comparePrice: e.target.value })}
                    placeholder="229.00"
                    className="w-full bg-[#0d1117] border border-gray-700 rounded-[4px] p-2.5 text-xs text-white focus:border-[#f20606] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-300 uppercase mb-1">
                    Estoque Inicial
                  </label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="10"
                    className="w-full bg-[#0d1117] border border-gray-700 rounded-[4px] p-2.5 text-xs text-white focus:border-[#f20606] focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Image URLs */}
              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">
                  URLs das Imagens (uma por linha) *
                </label>
                <textarea
                  rows={2}
                  value={productForm.imagesText}
                  onChange={(e) => setProductForm({ ...productForm, imagesText: e.target.value })}
                  placeholder="https://exemplo.com/foto1.jpg"
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-[4px] p-2 text-xs text-white focus:border-[#f20606] focus:outline-none font-mono"
                />
              </div>

              {/* Colors */}
              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">
                  Cores Disponíveis (formato: Nome (#HEX), separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={productForm.colorsText}
                  onChange={(e) => setProductForm({ ...productForm, colorsText: e.target.value })}
                  placeholder="Preto (#000000), Azul (#1e3a8a)"
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-[4px] p-2.5 text-xs text-white focus:border-[#f20606] focus:outline-none font-mono"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-gray-300 uppercase mb-1">
                  Descrição do Produto
                </label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Especificações técnicas e descrição do item..."
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-[4px] p-2 text-xs text-white focus:border-[#f20606] focus:outline-none"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer bg-[#0d1117] p-2.5 rounded border border-gray-800">
                  <input
                    type="checkbox"
                    checked={productForm.freeShipping}
                    onChange={(e) => setProductForm({ ...productForm, freeShipping: e.target.checked })}
                    className="rounded text-[#f20606] focus:ring-[#f20606] h-4 w-4"
                  />
                  <span>Frete Grátis</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-[#0d1117] p-2.5 rounded border border-gray-800">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="rounded text-[#f20606] focus:ring-[#f20606] h-4 w-4"
                  />
                  <span>Destaque na Home</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-[#0d1117] p-2.5 rounded border border-gray-800">
                  <input
                    type="checkbox"
                    checked={productForm.isSale}
                    onChange={(e) => setProductForm({ ...productForm, isSale: e.target.checked })}
                    className="rounded text-[#f20606] focus:ring-[#f20606] h-4 w-4"
                  />
                  <span>Selo de Oferta</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-gray-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white bg-gray-800 rounded cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#f20606] hover:bg-[#d40505] text-white text-xs font-bold uppercase tracking-wider px-6 py-2 rounded shadow-md cursor-pointer"
                >
                  {editingProductId ? 'Salvar Alterações' : 'Cadastrar Produto'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
