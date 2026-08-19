import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { WhatsAppIcon } from '../components/common/Icons';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSubmitted(false), 6000);
    }, 500);
  };

  return (
    <div className="min-h-screen pb-16">
      
      {/* Page Header */}
      <div className="bg-neutral-900 text-white py-6 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            <span>/</span>
            <span className="text-white font-medium">Contato</span>
          </div>
          <h1 className="text-2xl font-extrabold uppercase tracking-wide">
            Fale Conosco
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Estamos prontos para atender você e tirar todas as suas dúvidas.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Contact Direct Info Column */}
          <div className="md:col-span-5 space-y-4">
            
            {/* WhatsApp Card */}
            <a
              href="https://wa.me/5521972893879"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white p-5 rounded-[4px] border border-gray-100 shadow-xs hover:border-[#25D366] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-50 text-[#25D366] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <WhatsAppIcon className="w-6 h-6 fill-[#25D366]" />
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 uppercase font-bold tracking-wider">Atendimento Rápido</span>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    +55 (21) 97289-3879
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Clique para iniciar conversa</p>
                </div>
              </div>
            </a>

            {/* Phone Card */}
            <div className="bg-white p-5 rounded-[4px] border border-gray-100 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-neutral-100 text-gray-800 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-gray-400 uppercase font-bold tracking-wider">Telefone Comercial</span>
                  <h3 className="text-sm font-bold text-gray-900">(21) 97289-3879</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Segunda a Sexta das 09h às 18h</p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-neutral-900 text-white p-5 rounded-[4px] shadow-xs">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-[#f20606]" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Horário de Atendimento</h3>
              </div>
              <p className="text-xs text-gray-300">
                Nosso suporte online funciona de Segunda a Sexta-feira das 09h às 18h e aos Sábados das 09h às 13h.
              </p>
            </div>

          </div>

          {/* Contact Message Form Column */}
          <div className="md:col-span-7 bg-white rounded-[4px] border border-gray-100 p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-bold uppercase tracking-wider text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Envie Uma Mensagem
            </h2>

            {submitted ? (
              <div className="p-6 text-center space-y-2 bg-green-50 rounded-[4px] border border-green-200 animate-in zoom-in-95">
                <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto" />
                <h3 className="text-sm font-bold text-green-900">Mensagem enviada com sucesso!</h3>
                <p className="text-xs text-green-700">
                  Nossa equipe responderá em breve através do e-mail ou WhatsApp informado.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ex.: Maria Perez"
                    className="w-full bg-white border border-gray-300 rounded-[4px] px-3.5 py-2.5 text-xs text-gray-900 focus:border-black focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ex.: seuemail@email.com.br"
                      className="w-full bg-white border border-gray-300 rounded-[4px] px-3.5 py-2.5 text-xs text-gray-900 focus:border-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="ex.: (21) 97289-3879"
                      className="w-full bg-white border border-gray-300 rounded-[4px] px-3.5 py-2.5 text-xs text-gray-900 focus:border-black focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Sua Mensagem *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Escreva sua dúvida, sugestão ou pedido..."
                    className="w-full bg-white border border-gray-300 rounded-[4px] px-3.5 py-2.5 text-xs text-gray-900 focus:border-black focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#f20606] hover:bg-[#d40505] text-white font-extrabold py-3.5 px-4 rounded-[4px] uppercase text-xs tracking-wider shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}</span>
                </button>
              </form>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
