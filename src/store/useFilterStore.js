import { create } from 'zustand';

export const useFilterStore = create((set, get) => ({
  selectedCategory: 'todos',
  selectedColors: [],
  priceRange: { min: '', max: '' },
  sortBy: 'mais-vendidos',
  searchQuery: '',
  isMobileFilterOpen: false,

  setCategory: (category) => set({ selectedCategory: category }),
  
  toggleColor: (colorName) => {
    const current = get().selectedColors;
    if (current.includes(colorName)) {
      set({ selectedColors: current.filter((c) => c !== colorName) });
    } else {
      set({ selectedColors: [...current, colorName] });
    }
  },

  setPriceRange: (min, max) => set({ priceRange: { min, max } }),

  setSortBy: (sortBy) => set({ sortBy }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setMobileFilterOpen: (isOpen) => set({ isMobileFilterOpen: isOpen }),

  resetFilters: () => set({
    selectedCategory: 'todos',
    selectedColors: [],
    priceRange: { min: '', max: '' },
    sortBy: 'mais-vendidos',
    searchQuery: ''
  })
}));
