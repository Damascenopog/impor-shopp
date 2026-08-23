import { products } from '../data/products';

/**
 * Strict rules for complementary products per category
 */
const CATEGORY_RULES = {
  'original-apple': {
    compatibleCategories: ['original-apple'],
    mustIncludeAnyWord: ['apple', 'iphone', 'magsafe', 'airpods', 'lightning', 'earpods', 'ipad', 'mac'],
    strictlyExcludeWords: ['teclado', 'mouse', 'gamer', 'ps2', 'caixa de som', 'karaokê', 'repetidor', 'roteador', 'tv box']
  },
  'smartwatches': {
    compatibleCategories: ['smartwatches'],
    mustIncludeAnyWord: ['smartwatch', 'relógio', 'relogio', 'smartband', 'pulseira', 'amoled', 'indução', 'w69', 'w99', 'iwo', 'zl02d', 'm8'],
    strictlyExcludeWords: ['teclado', 'mouse', 'gamer', 'ps2', 'caixa de som', 'karaokê', 'microfone', 'repetidor', 'roteador', 'conversor', 'tv box']
  },
  'caixas-de-som': {
    compatibleCategories: ['caixas-de-som'],
    mustIncludeAnyWord: ['caixa de som', 'som', 'áudio', 'audio', 'karaokê', 'karaoke', 'microfone', 'bluetooth', 'alto-falante', 'speaker', 'headphone', 'fone', 'boombox'],
    strictlyExcludeWords: ['smartwatch', 'relógio', 'pulseira', 'teclado', 'mouse', 'gamer', 'roteador', 'repetidor', 'hd externo']
  },
  'gamer': {
    compatibleCategories: ['gamer'],
    mustIncludeAnyWord: ['gamer', 'teclado', 'mouse', 'rgb', 'controle', 'dualshock', 'ps2', 'headset', 'pad'],
    strictlyExcludeWords: ['smartwatch', 'relógio', 'pulseira', 'caixa de som karaokê', 'conversor digital', 'magsafe']
  },
  'redes-e-conectividade': {
    compatibleCategories: ['redes-e-conectividade'],
    mustIncludeAnyWord: ['wi-fi', 'wifi', 'repetidor', 'roteador', 'antenas', 'internet', 'rede', 'wireless'],
    strictlyExcludeWords: ['smartwatch', 'relógio', 'caixa de som', 'karaokê', 'controle ps2', 'airpods']
  },
  'cabos-e-carregadores': {
    compatibleCategories: ['cabos-e-carregadores', 'original-apple', 'acessorios'],
    mustIncludeAnyWord: ['cabo', 'carregador', 'tipo-c', 'lightning', 'turbo', 'fonte', 'usb'],
    strictlyExcludeWords: ['caixa de som torre', 'microfone karaokê', 'repetidor wifi', 'teclado gamer']
  },
  'eletronicos': {
    compatibleCategories: ['eletronicos', 'redes-e-conectividade'],
    mustIncludeAnyWord: ['tv box', 'conversor', 'smart tv', '4k', 'android', 'hdmi'],
    strictlyExcludeWords: ['smartwatch pulseira', 'controle ps2']
  },
  'acessorios': {
    compatibleCategories: ['acessorios', 'cabos-e-carregadores'],
    mustIncludeAnyWord: ['adaptador', 'case', 'hd', 'suporte', 'cabo'],
    strictlyExcludeWords: ['caixa de som torre', 'smartwatch ultra']
  }
};

/**
 * Intelligent and strictly contextual recommendation engine
 * @param {Object} currentProduct - The product currently being viewed
 * @param {Array} allProducts - Catalog array of products
 * @param {number} limit - Maximum number of recommendations to return
 * @returns {Array} List of highly relevant recommended products
 */
export const getRecommendedProducts = (currentProduct, allProducts = products, limit = 8) => {
  if (!currentProduct) return allProducts.slice(0, limit);

  const category = currentProduct.category || 'todos';
  const rules = CATEGORY_RULES[category];

  // 1. First priority: Gather all other products in the exact same category
  const sameCategoryProducts = allProducts.filter(
    (p) => p.category === category && p.id !== currentProduct.id && p.slug !== currentProduct.slug
  );

  // If there are already enough products in the exact same category, return them directly
  if (sameCategoryProducts.length >= limit) {
    return sameCategoryProducts.slice(0, limit);
  }

  // 2. If same category has fewer than `limit`, select ONLY strictly compatible items
  const otherCandidates = allProducts.filter(
    (p) => p.category !== category && p.id !== currentProduct.id && p.slug !== currentProduct.slug
  );

  const scoredOtherProducts = otherCandidates
    .map((candidate) => {
      let score = 0;
      const candidateText = `${candidate.name} ${candidate.categoryName || ''} ${candidate.description || ''} ${candidate.brand || ''}`.toLowerCase();

      if (rules) {
        // Exclude if it contains any forbidden keywords for this niche
        const isForbidden = rules.strictlyExcludeWords.some((w) => candidateText.includes(w));
        if (isForbidden) return { product: candidate, score: -100 };

        // Must match at least one specific niche keyword
        const hasKeywordMatch = rules.mustIncludeAnyWord.some((w) => candidateText.includes(w));
        if (!hasKeywordMatch) return { product: candidate, score: -100 };

        // Must belong to compatible category
        if (rules.compatibleCategories.includes(candidate.category)) {
          score += 30;
        }

        // Specific keyword count
        const matchCount = rules.mustIncludeAnyWord.filter((w) => candidateText.includes(w)).length;
        score += matchCount * 10;
      }

      // Brand match boost
      if (candidate.brand && currentProduct.brand && candidate.brand.toLowerCase() === currentProduct.brand.toLowerCase()) {
        score += 15;
      }

      return { product: candidate, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.product);

  const combined = [...sameCategoryProducts, ...scoredOtherProducts];
  return combined.slice(0, limit);
};

/**
 * Returns a strictly relevant bundle/cross-sell item
 */
export const getBundleRecommendation = (currentProduct, allProducts = products) => {
  if (!currentProduct) return null;

  const category = currentProduct.category;

  if (category === 'original-apple') {
    // For Apple, pair with Apple Cable or MagSafe or EarPods
    const accessory = allProducts.find(
      (p) => p.id !== currentProduct.id && p.category === 'original-apple' && (p.slug.includes('cabo') || p.slug.includes('magsafe') || p.slug.includes('carregador'))
    );
    if (accessory) return accessory;
  }

  if (category === 'smartwatches') {
    const accessory = allProducts.find(
      (p) => p.id !== currentProduct.id && (p.slug.includes('pulseira') || p.slug.includes('carregador-magnetico'))
    );
    if (accessory) return accessory;
  }

  if (category === 'caixas-de-som') {
    const accessory = allProducts.find(
      (p) => p.id !== currentProduct.id && (p.slug.includes('microfone') || p.slug.includes('headphone') || p.category === 'caixas-de-som')
    );
    if (accessory) return accessory;
  }

  if (category === 'gamer') {
    const accessory = allProducts.find(
      (p) => p.id !== currentProduct.id && p.category === 'gamer'
    );
    if (accessory) return accessory;
  }

  // Fallback to highest scored recommended item
  const recommendations = getRecommendedProducts(currentProduct, allProducts, 2);
  return recommendations[0] || null;
};
