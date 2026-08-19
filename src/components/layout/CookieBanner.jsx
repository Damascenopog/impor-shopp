import React, { useState, useEffect } from 'react';

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('imporshopp-cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('imporshopp-cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside aria-label="Aviso de Cookies" className="fixed bottom-0 inset-x-0 bg-neutral-950/95 text-white border-t border-neutral-800 p-4 z-40 backdrop-blur-xs animate-in slide-in-from-bottom duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p className="text-gray-300 text-center sm:text-left leading-relaxed">
          Ao navegar por este site você aceita o uso de cookies para personalizar sua experiência de compra e analisar nosso tráfego.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAccept}
            className="bg-[#f20606] hover:bg-[#d40505] text-white font-bold px-5 py-2 rounded-[4px] transition-colors whitespace-nowrap"
          >
            Aceitar e Continuar
          </button>
        </div>
      </div>
    </aside>
  );
};
