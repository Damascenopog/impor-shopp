import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSuccess(true);
      setEmail('');
      setTimeout(() => setIsSuccess(false), 5000);
    }
  };

  return (
    <section className="bg-gradient-to-r from-neutral-900 via-black to-neutral-900 text-white rounded-[6px] p-6 sm:p-10 my-10 shadow-lg border border-neutral-800">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#f20606]/20 text-[#f20606] mb-3">
          <Mail className="w-6 h-6" />
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wide text-white mb-2">
          Receba Nossas Melhores Ofertas
        </h3>
        <p className="text-xs sm:text-sm text-gray-300 mb-6 max-w-lg mx-auto">
          Cadastre seu e-mail para receber cupons exclusivos, lançamentos e promoções em primeira mão.
        </p>

        {isSuccess ? (
          <div className="inline-flex items-center gap-2 bg-green-950/80 border border-green-600 text-green-300 px-5 py-3 rounded-[4px] text-xs font-semibold animate-in zoom-in-95">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span>Obrigado! Seu e-mail foi cadastrado com sucesso.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu melhor e-mail..."
              className="flex-1 bg-[#1a1a1a] text-white text-xs sm:text-sm px-4 py-3 rounded-[4px] border border-neutral-700 focus:border-[#f20606] focus:outline-none placeholder:text-gray-500"
            />
            <button
              type="submit"
              className="bg-[#f20606] hover:bg-[#d40505] text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-[4px] transition-colors shadow-md shrink-0"
            >
              Cadastrar
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
