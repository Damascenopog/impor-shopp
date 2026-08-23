import { products } from '../data/products';

/**
 * Related category mapping for intelligent cross-category recommendations
 */
const RELATED_CATEGORIES_MAP = {
  'caixas-de-som': ['eletronicos', 'cabos-e-carregadores', 'acessorios'],
  'smartwatches': ['acessorios', 'cabos-e-carregadores', 'original-apple'],
  'gamer': ['acessorios', 'redes-e-conectividade', 'eletronicos'],
  'redes-e-conectividade': ['gamer', 'acessorios', 'eletronicos'],
  'original-apple': ['cabos-e-carregadores', 'acessorios', 'smartwatches'],
  'cabos-e-carregadores': ['original-apple', 'smartwatches', 'caixas-de-som', 'acessorios'],
  'eletronicos': ['caixas-de-som', 'redes-e-conectividade', 'gamer', 'acessorios'],
  'acessorios': ['cabos-e-carregadores', 'gamer', 'smartwatches', 'caixas-de-som']
};

/**
 * Key audio and product interest tags for contextual matching
 */
const KEYWORD_GROUPS = [
  { group: 'sound_audio', words: ['som', 'áudio', 'audio', 'caixa', 'bluetooth', 'karaoke', 'karaokê', 'microfone', 'alto-falante', 'speaker', 'grave', 'potência', 'fone', 'headphone', 'música', 'surround'] },
  { group: 'apple_power', words: ['apple', 'iphone', 'magsafe', 'airpods', 'lightning', 'turbo', '20w', 'carregador', 'cabo'] },
  { group: 'smartwatch_wearable', words: ['smartwatch', 'relógio', 'relogio', 'pulseira', 'amoled', 'nfc', 'w69', 'watch'] },
  { group: 'gaming_peripherals', words: ['gamer', 'teclado', 'mouse', 'rgb', 'controle', 'ps2', 'ps4', 'jogo', 'analógico'] },
  { group: 'network_internet', words: ['wi-fi', 'wifi', 'repetidor', 'roteador', 'antenas', 'internet', 'rede', 'wireless'] },
  { group: 'tv_media', words: ['tv box', 'tv', 'conversor', '4k', 'android', 'smart tv', 'hdmi'] }
];

/**
 * Intelligent recommendation engine for products
 * @param {Object} currentProduct - The product currently being viewed
 * @param {Array} allProducts - Catalog array of products
 * @param {number} limit - Maximum number of recommendations to return
 * @returns {Array} List of highly relevant recommended products
 */
export const getRecommendedProducts = (currentProduct, allProducts = products, limit = 8) => {
  if (!currentProduct) return allProducts.slice(0, limit);

  const currentText = `${currentProduct.name} ${currentProduct.categoryName || ''} ${currentProduct.description || ''} ${currentProduct.brand || ''}`.toLowerCase();

  // Find active keyword groups for the current product
  const activeGroups = KEYWORD_GROUPS.filter((g) =>
    g.words.some((word) => currentText.includes(word))
  ).map((g) => g.group);

  const relatedCategories = RELATED_CATEGORIES_MAP[currentProduct.category] || [];

  const scoredProducts = allProducts
    .filter((p) => p.id !== currentProduct.id && p.slug !== currentProduct.slug)
    .map((candidate) => {
      let score = 0;
      const candidateText = `${candidate.name} ${candidate.categoryName || ''} ${candidate.description || ''} ${candidate.brand || ''}`.toLowerCase();

      // 1. Same category is highest priority
      if (candidate.category === currentProduct.category) {
        score += 40;
      } else if (relatedCategories.includes(candidate.category)) {
        score += 15;
      }

      // 2. Keyword group overlap (e.g. sound/audio, gaming, etc.)
      activeGroups.forEach((groupName) => {
        const groupObj = KEYWORD_GROUPS.find((g) => g.group === groupName);
        if (groupObj) {
          const matchCount = groupObj.words.filter((w) => candidateText.includes(w)).length;
          score += matchCount * 8;
        }
      });

      // 3. Same Brand
      if (candidate.brand && currentProduct.brand && candidate.brand.toLowerCase() === currentProduct.brand.toLowerCase()) {
        score += 10;
      }

      // 4. Feature and popularity boosts
      if (candidate.isFeatured) score += 5;
      if (candidate.isSale) score += 3;
      if (candidate.rating >= 4.8) score += 4;

      return { product: candidate, score };
    });

  // Sort by score descending
  scoredProducts.sort((a, b) => b.score - a.score);

  // Extract top items
  let recommended = scoredProducts.slice(0, limit).map((sp) => sp.product);

  // Fallback: If not enough, append other items
  if (recommended.length < limit) {
    const existingIds = new Set([currentProduct.id, ...recommended.map((r) => r.id)]);
    const fill = allProducts.filter((p) => !existingIds.has(p.id)).slice(0, limit - recommended.length);
    recommended = [...recommended, ...fill];
  }

  return recommended;
};

/**
 * Returns bundle/cross-sell recommendation (e.g. Buy together with discount)
 */
export const getBundleRecommendation = (currentProduct, allProducts = products) => {
  if (!currentProduct) return null;

  // Find complementary item from related categories or accessories
  const complementaryCategories = ['cabos-e-carregadores', 'acessorios', 'caixas-de-som'];
  const match = allProducts.find(
    (p) =>
      p.id !== currentProduct.id &&
      (complementaryCategories.includes(p.category) || p.price < currentProduct.price * 0.5)
  );

  return match || allProducts.find((p) => p.id !== currentProduct.id);
};
