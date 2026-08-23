import { products } from '../data/products';

/**
 * Strict category to accessory/complement mapping
 * Ensures recommendations never mix unrelated niches (e.g. speakers in smartwatches)
 */
const STRICT_NICHE_MAP = {
  'smartwatches': {
    primaryCategory: 'smartwatches',
    allowedKeywords: ['smartwatch', 'relógio', 'relogio', 'smartband', 'pulseira', 'amoled', 'indução', 'w69', 'w99', 'iwo', 'zl02d', 'm8'],
    excludeKeywords: ['caixa de som', 'karaokê', 'microfone', 'teclado', 'gamer', 'repetidor', 'roteador', 'conversor', 'tv box', 'case externa hd']
  },
  'caixas-de-som': {
    primaryCategory: 'caixas-de-som',
    allowedKeywords: ['caixa de som', 'som', 'áudio', 'audio', 'karaokê', 'karaoke', 'microfone', 'bluetooth', 'alto-falante', 'speaker', 'headphone', 'fone', 'boombox', 'altomex'],
    excludeKeywords: ['smartwatch', 'relógio', 'pulseira', 'teclado gamer', 'roteador', 'repetidor', 'hd externo']
  },
  'original-apple': {
    primaryCategory: 'original-apple',
    allowedKeywords: ['apple', 'iphone', 'airpods', 'magsafe', 'lightning', '20w', 'turbo', 'cabo'],
    excludeKeywords: ['caixa de som', 'karaokê', 'repetidor', 'roteador', 'tv box', 'ps2']
  },
  'gamer': {
    primaryCategory: 'gamer',
    allowedKeywords: ['gamer', 'teclado', 'mouse', 'rgb', 'controle', 'dualshock', 'ps2', 'headset', 'pad'],
    excludeKeywords: ['smartwatch', 'relógio', 'pulseira', 'caixa de som karaokê', 'conversor digital']
  },
  'redes-e-conectividade': {
    primaryCategory: 'redes-e-conectividade',
    allowedKeywords: ['wi-fi', 'wifi', 'repetidor', 'roteador', 'antenas', 'internet', 'rede', 'wireless'],
    excludeKeywords: ['smartwatch', 'relógio', 'caixa de som', 'karaokê', 'controle ps2']
  },
  'cabos-e-carregadores': {
    primaryCategory: 'cabos-e-carregadores',
    allowedKeywords: ['cabo', 'carregador', 'tipo-c', 'lightning', 'turbo', 'fonte', 'usb'],
    excludeKeywords: ['caixa de som torre', 'microfone karaokê', 'repetidor wifi']
  },
  'eletronicos': {
    primaryCategory: 'eletronicos',
    allowedKeywords: ['tv box', 'conversor', 'smart tv', '4k', 'android', 'hdmi', 'adaptador'],
    excludeKeywords: ['smartwatch pulseira']
  },
  'acessorios': {
    primaryCategory: 'acessorios',
    allowedKeywords: ['adaptador', 'case', 'hd', 'suporte', 'cabo'],
    excludeKeywords: ['caixa de som torre']
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
  const niche = STRICT_NICHE_MAP[category];

  // 1. Gather all other products in the exact same category
  const sameCategoryProducts = allProducts.filter(
    (p) => p.category === category && p.id !== currentProduct.id && p.slug !== currentProduct.slug
  );

  // If we have enough products in the exact same category, return them directly
  if (sameCategoryProducts.length >= limit) {
    return sameCategoryProducts.slice(0, limit);
  }

  // 2. If we need more items to fill up to `limit`, only pull strictly relevant items
  const otherCandidates = allProducts.filter(
    (p) => p.category !== category && p.id !== currentProduct.id && p.slug !== currentProduct.slug
  );

  const scoredOtherProducts = otherCandidates
    .map((candidate) => {
      let score = 0;
      const candidateText = `${candidate.name} ${candidate.categoryName || ''} ${candidate.description || ''} ${candidate.brand || ''}`.toLowerCase();

      if (niche) {
        // Exclude if it contains any blacklisted keyword for this niche
        const hasExcluded = niche.excludeKeywords.some((w) => candidateText.includes(w));
        if (hasExcluded) return { product: candidate, score: -100 };

        // Match allowed keywords
        const matchCount = niche.allowedKeywords.filter((w) => candidateText.includes(w)).length;
        score += matchCount * 15;
      }

      // Brand match boost
      if (candidate.brand && currentProduct.brand && candidate.brand.toLowerCase() === currentProduct.brand.toLowerCase()) {
        score += 5;
      }

      return { product: candidate, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.product);

  // Combine same category first + strictly scored matches
  const combined = [...sameCategoryProducts, ...scoredOtherProducts];

  return combined.slice(0, limit);
};

/**
 * Returns a strictly relevant bundle/cross-sell item (e.g. Smartwatch + Pulseira / Caixa de Som + Microfone)
 */
export const getBundleRecommendation = (currentProduct, allProducts = products) => {
  if (!currentProduct) return null;

  const category = currentProduct.category;

  // Dedicated smart pairings
  if (category === 'smartwatches') {
    // Pair smartwatch with pulseiras or magnetic charger
    const accessory = allProducts.find(
      (p) => p.id !== currentProduct.id && (p.slug.includes('pulseira') || p.slug.includes('carregador-magnetico') || p.slug.includes('smartband'))
    );
    if (accessory) return accessory;
  }

  if (category === 'caixas-de-som') {
    // Pair sound box with microphone or headphone or another speaker
    const accessory = allProducts.find(
      (p) => p.id !== currentProduct.id && (p.slug.includes('microfone') || p.slug.includes('headphone') || p.category === 'caixas-de-som')
    );
    if (accessory) return accessory;
  }

  if (category === 'original-apple') {
    // Pair with AirPods or 20W charger or Type-C cable
    const accessory = allProducts.find(
      (p) => p.id !== currentProduct.id && (p.slug.includes('cabo') || p.category === 'original-apple')
    );
    if (accessory) return accessory;
  }

  if (category === 'gamer') {
    // Pair with keyboard/mouse or controller
    const accessory = allProducts.find(
      (p) => p.id !== currentProduct.id && (p.category === 'gamer' || p.slug.includes('cabo'))
    );
    if (accessory) return accessory;
  }

  // Fallback to highest scored recommended item
  const recommendations = getRecommendedProducts(currentProduct, allProducts, 2);
  return recommendations[0] || null;
};
