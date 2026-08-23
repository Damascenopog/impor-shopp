import React from 'react';
import { HeroSlider } from '../components/home/HeroSlider';
import { InfoBar } from '../components/home/InfoBar';
import { ProductGrid } from '../components/product/ProductGrid';
import { OffersCarousel } from '../components/home/OffersCarousel';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { useAdminStore } from '../store/useAdminStore';

export const HomePage = () => {
  const products = useAdminStore((state) => state.products);
  const lancamentos = products.filter((p) => p.isNew || p.isFeatured).slice(0, 8);
  const ofertas = products.filter((p) => p.isSale || p.discountPercentage > 0);
  const variedades = products.slice(0, 12);

  return (
    <div className="min-h-screen">
      {/* Hero Banner Slider */}
      <HeroSlider />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Info & Benefits Bar */}
        <InfoBar />

        {/* Lançamentos Section */}
        <ProductGrid
          title="Lançamentos"
          subtitle="Os produtos mais recentes que acabaram de chegar na Imporshopp"
          products={lancamentos}
          columns={4}
        />

        {/* Ofertas Slider Carousel */}
        <OffersCarousel
          title="Ofertas e Promoções"
          products={ofertas}
        />

        {/* Variedades Section */}
        <ProductGrid
          title="Variedades em Eletrônicos"
          subtitle="Confira nossa seleção completa para o seu dia a dia"
          products={variedades}
          columns={4}
        />

        {/* Newsletter Signup */}
        <NewsletterSection />

      </div>
    </div>
  );
};
