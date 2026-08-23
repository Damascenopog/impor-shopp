import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { heroBanners } from '../../data/mockData';

export const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === heroBanners.length - 1 ? 0 : prev + 1));
    }, 5500);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? heroBanners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === heroBanners.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-neutral-900 shadow-md group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {heroBanners.map((banner) => (
          <div key={banner.id} className="min-w-full relative aspect-[16/7] sm:aspect-[21/8] max-h-[500px]">
            <Link to={banner.link} className="block w-full h-full relative">
              {/* Desktop Image */}
              <img
                src={banner.desktopImage}
                alt={banner.title}
                className="w-full h-full object-cover hidden sm:block"
                loading="eager"
              />
              {/* Mobile Image */}
              <img
                src={banner.mobileImage}
                alt={banner.title}
                className="w-full h-full object-cover sm:hidden"
                loading="eager"
              />

              {/* Overlay Gradient for readability if text overlay is used */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent flex items-center p-6 sm:p-12 lg:p-16">
                <div className="max-w-md text-white">
                  <span className="inline-block bg-[#f20606] text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-[2px] mb-2 shadow-xs">
                    Destaques da Semana
                  </span>
                  <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-white mb-2 drop-shadow-md">
                    {banner.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-200 mb-4 line-clamp-2 drop-shadow">
                    {banner.subtitle}
                  </p>
                  <span className="inline-flex items-center gap-2 bg-[#f20606] hover:bg-[#d40505] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider px-5 py-2.5 rounded-[4px] shadow-lg transition-transform transform group-hover:scale-105">
                    {banner.ctaText}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 shadow-md cursor-pointer z-20"
        aria-label="Banner Anterior"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 shadow-md cursor-pointer z-20"
        aria-label="Próximo Banner"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Pagination Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {heroBanners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === idx ? 'w-7 bg-[#f20606]' : 'w-2 bg-white/60 hover:bg-white'
            }`}
            aria-label={`Ir para banner ${idx + 1}`}
          />
        ))}
      </div>

    </div>
  );
};
