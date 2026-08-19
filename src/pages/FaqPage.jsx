import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { faqItems } from '../data/mockData';

export const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen pb-16">
      
      {/* Page Header */}
      <div className="bg-neutral-900 text-white py-6 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            <span>/</span>
            <span className="text-white font-medium">Perguntas Frequentes</span>
          </div>
          <h1 className="text-2xl font-extrabold uppercase tracking-wide">
            Perguntas Frequentes
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Encontre respostas para as principais dúvidas sobre pedidos, frete, trocas e pagamentos.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Payment Methods Graphic Banner */}
        <div className="bg-white rounded-[4px] border border-gray-100 p-6 shadow-xs mb-6 text-center">
          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700 mb-3">
            Formas de Pagamento Aceitas
          </h3>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="bg-gray-100 px-3 py-1.5 rounded font-bold text-xs text-gray-800">PIX (Imediato)</span>
            <span className="bg-gray-100 px-3 py-1.5 rounded font-bold text-xs text-gray-800">Cartão de Crédito até 12x</span>
            <span className="bg-gray-100 px-3 py-1.5 rounded font-bold text-xs text-gray-800">Boleto Bancário</span>
          </div>
        </div>

        {/* FAQ Accordions */}
        <div className="space-y-3">
          {faqItems.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-[4px] border border-gray-100 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm text-gray-900 hover:text-[#f20606] transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#f20606] shrink-0" />
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-black' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3 animate-in fade-in">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-8 bg-neutral-900 text-white rounded-[4px] p-6 text-center space-y-3 shadow-md">
          <h3 className="font-bold text-sm uppercase tracking-wide">Ainda tem alguma dúvida?</h3>
          <p className="text-xs text-gray-300 max-w-md mx-auto">
            Nossa equipe de suporte está à disposição no WhatsApp para esclarecer qualquer ponto.
          </p>
          <a
            href="https://wa.me/5521972893879"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold text-xs uppercase tracking-wider px-6 py-2.5 rounded-[4px] transition-colors"
          >
            Chamar no WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
};
