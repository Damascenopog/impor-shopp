import React from 'react';
import { WhatsAppIcon } from '../common/Icons';

export const FloatingWhatsApp = () => {
  return (
    <aside aria-label="Atendimento via WhatsApp" className="fixed bottom-6 right-6 z-40">
      <a
        href="https://wa.me/5521972893879?text=Ol%C3%A1%2C%20gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20os%20produtos%20da%20Imporshopp!"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-110 hover:shadow-green-500/30 transition-all duration-300 group"
        aria-label="Conversar no WhatsApp"
        title="Fale conosco no WhatsApp"
      >
        <WhatsAppIcon className="w-8 h-8 fill-white" />
        
        {/* Tooltip hint on hover */}
        <span className="absolute right-16 bg-neutral-900 text-white text-xs font-semibold px-3 py-1.5 rounded-[4px] shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden sm:block">
          Dúvidas? Fale conosco!
        </span>
      </a>
    </aside>
  );
};
