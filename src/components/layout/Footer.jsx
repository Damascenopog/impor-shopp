import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { InstagramIcon } from '../common/Icons';

export const Footer = () => {
  const [openSections, setOpenSections] = useState({
    departamentos: false,
    contato: false,
    newsletter: true
  });

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubmitted(false), 5000);
    }
  };

  return (
    <footer className="bg-[#000000] text-white pt-10 pb-6 border-t border-neutral-800">
      
      {/* Social Footer Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-8 border-b border-neutral-900">
        <a
          href="https://instagram.com/imporshopp_"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1c1c1c] text-white hover:text-pink-500 hover:bg-neutral-800 transition-all shadow-md group"
          aria-label="Instagram Imporshopp"
        >
          <InstagramIcon className="w-6 h-6 transition-transform group-hover:scale-110" />
        </a>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Departamentos Column */}
          <div className="border-b border-neutral-900 md:border-0 pb-4 md:pb-0">
            <button
              onClick={() => toggleSection('departamentos')}
              className="w-full flex items-center justify-between md:cursor-default text-left font-bold text-xs uppercase tracking-wider py-2 md:py-0 text-white"
            >
              <span>Departamentos</span>
              <ChevronDown
                className={`w-4 h-4 md:hidden text-gray-400 transition-transform ${
                  openSections.departamentos ? 'rotate-180' : ''
                }`}
              />
            </button>

            <div className={`mt-3 space-y-2 text-xs font-normal text-gray-400 ${openSections.departamentos ? 'block' : 'hidden md:block'}`}>
              <p><Link to="/" className="hover:text-white transition-colors">Início</Link></p>
              <p><Link to="/produtos" className="hover:text-white transition-colors">Produtos</Link></p>
              <p><Link to="/original-apple" className="hover:text-[#3fef09] transition-colors font-medium">Original Apple</Link></p>
              <p><Link to="/contato" className="hover:text-white transition-colors">Contato</Link></p>
              <p><Link to="/perguntas-frequentes" className="hover:text-white transition-colors">Perguntas Frequentes</Link></p>
              <p><Link to="/como-comprar" className="hover:text-white transition-colors">Como Comprar</Link></p>
              <p><Link to="/trocas-e-devolucoes" className="hover:text-white transition-colors">Trocas e Devoluções</Link></p>
              <p><Link to="/quem-somos" className="hover:text-white transition-colors">Quem Somos</Link></p>
            </div>
          </div>

          {/* Entre em Contato Column */}
          <div className="border-b border-neutral-900 md:border-0 pb-4 md:pb-0">
            <button
              onClick={() => toggleSection('contato')}
              className="w-full flex items-center justify-between md:cursor-default text-left font-bold text-xs uppercase tracking-wider py-2 md:py-0 text-white"
            >
              <span>Entre em contato</span>
              <ChevronDown
                className={`w-4 h-4 md:hidden text-gray-400 transition-transform ${
                  openSections.contato ? 'rotate-180' : ''
                }`}
              />
            </button>

            <div className={`mt-3 space-y-3 text-xs text-gray-400 ${openSections.contato ? 'block' : 'hidden md:block'}`}>
              <div>
                <span className="block text-gray-500 text-[11px]">WhatsApp Oficial:</span>
                <a
                  href="https://wa.me/5521972893879"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#3fef09] font-medium transition-colors"
                >
                  +55 (21) 97289-3879
                </a>
              </div>
              <div>
                <span className="block text-gray-500 text-[11px]">Telefone de Atendimento:</span>
                <a href="tel:21972893879" className="text-white hover:text-white font-medium transition-colors">
                  (21) 97289-3879
                </a>
              </div>
              <div>
                <span className="block text-gray-500 text-[11px]">Horário de Atendimento:</span>
                <span className="text-gray-300">Segunda a Sexta: 09h às 18h</span>
              </div>
            </div>
          </div>

          {/* Novidades Imporshopp (Newsletter) Column */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-white mb-3">
              Novidades Imporshopp
            </h3>
            <p className="text-xs text-gray-400 mb-3">
              Cadastre-se para receber promoções exclusivas e cupons de desconto em primeira mão.
            </p>

            {newsletterSubmitted ? (
              <div className="bg-green-950/80 border border-green-700 text-green-300 p-3 rounded-[4px] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                <span>Obrigado! Seu e-mail foi cadastrado com sucesso.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Cadastre seu e-mail..."
                  className="flex-1 bg-[#1c1c1c] text-white text-xs rounded-[4px] px-3 py-2.5 border border-neutral-800 focus:border-[#f20606] focus:outline-none placeholder:text-gray-500"
                />
                <button
                  type="submit"
                  className="bg-[#f20606] hover:bg-[#d40505] text-white font-bold text-xs px-4 py-2.5 rounded-[4px] transition-colors"
                >
                  Enviar
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* Footer Legal & Nuvemshop Attribution */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-4 border-t border-neutral-900">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs text-gray-500">
          <div>
            <p>Copyright IMPORSHOPP - 2026. Todos os direitos reservados.</p>
          </div>

          {/* Nuvemshop Logo Attribution */}
          <div className="flex items-center gap-2 text-[11px]">
            <span>Tecnologia</span>
            <a
              href="https://www.nuvemshop.com.br"
              target="_blank"
              rel="nofollow noreferrer"
              className="text-gray-400 hover:text-white font-semibold transition-colors flex items-center gap-1.5"
            >
              <svg className="h-4 w-auto fill-current" viewBox="0 0 540 80">
                <path d="M29.9 42.8c4.6 0 8.8 1.3 12.5 3.8v7.9c-3.9-3-7.9-4.4-12.2-4.4-9 0-15.5 6.9-15.5 15.8 0 8.8 6.5 15.8 15.5 15.8 4.6 0 8.9-2.1 12.4-4.4v7.9c-3.9 2.5-8.1 3.7-12.7 3.7-13.8 0-23.1-10.1-23.1-23.1 0-12.9 9.5-23 23.1-23zM73.2 51c-.1 0-.3 0-.5-.1-.4 0-1-.1-1.6-.1-8.3 0-13.2 6.5-13.2 16.1v21h-7.7V43.8h7.6v7.8c1.9-5.1 7.8-8.5 13.5-8.5.6 0 1 .1 1.4.1.3.1.5.1.5.1V51zm9.9-15.1c-2.9 0-5.3-2.4-5.3-5.3s2.4-5.3 5.3-5.3 5.3 2.4 5.3 5.3-2.4 5.3-5.3 5.3zm3.9 7.9v44.1h-7.8V43.8H87zm23.6 18.3l13.2-1.6v-2.3c0-5.4-3.4-8.5-9.3-8.5-5.3 0-8.7 2.6-10.3 7.8l-7.4-2.1c2.2-7.7 8.9-12.6 17.5-12.6 10.8 0 17 6.1 17 16v29.1H124v-5.8c-3.5 4.4-8.9 6.8-14.8 6.8-8.3 0-13.9-5.4-13.9-12.6 0-7.9 5-12.8 15.3-14.2zm0 19.9c7.6 0 13.2-4.9 13.2-11.7v-3.2l-12 1.5c-5.5.7-8.6 3.4-8.6 7.2 0 3.7 3.1 6.2 7.4 6.2z"/>
              </svg>
              <span>Nuvemshop</span>
            </a>
          </div>
        </div>
      </div>

    </footer>
  );
};
