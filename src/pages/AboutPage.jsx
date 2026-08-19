import React from 'react';
import { Link } from 'react-router-dom';
import { Award, CheckCircle, Zap, Users, ShieldCheck } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="min-h-screen pb-16">
      
      {/* Header */}
      <div className="bg-neutral-900 text-white py-6 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            <span>/</span>
            <span className="text-white font-medium">Quem Somos</span>
          </div>
          <h1 className="text-2xl font-extrabold uppercase tracking-wide">
            Sobre a Imporshopp
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Sua fonte confiável para eletrônicos e acessórios de alta qualidade no Brasil.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-[4px] border border-gray-100 p-6 sm:p-10 shadow-xs space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
          
          <div className="border-b border-gray-100 pb-4">
            <h2 className="font-extrabold text-base uppercase text-gray-900 mb-2">
              Quem Somos
            </h2>
            <p>
              Na <strong>ImporShopp</strong>, estamos comprometidos em fornecer uma experiência de compra excepcional para entusiastas de tecnologia e consumidores exigentes em todo o Brasil. Desde os últimos gadgets até componentes e acessórios essenciais, nossa missão é oferecer eletrônicos de procedência comprovada a preços justos.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-sm text-gray-900 mb-1">Nossa História</h3>
            <p>
              Fundada por apaixonados por tecnologia, a ImporShopp nasceu da visão de tornar a compra de eletrônicos mais ágil, transparente e acessível. Com anos de dedicação no setor, construímos uma reputação sólida baseada em confiança, pontualidade nas entregas e pós-venda atencioso.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-sm text-gray-900 mb-2">Por que escolher a Imporshopp?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              
              <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-[4px]">
                <ShieldCheck className="w-5 h-5 text-[#f20606] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900 text-xs uppercase">Qualidade Garantida</h4>
                  <p className="text-[11px] text-gray-600 mt-0.5">Todos os produtos são testados e certificados antes do envio.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-[4px]">
                <Zap className="w-5 h-5 text-[#3fef09] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900 text-xs uppercase">Envio Rápido</h4>
                  <p className="text-[11px] text-gray-600 mt-0.5">Despacho ágil com código de rastreamento direto no seu e-mail.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-[4px]">
                <Users className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900 text-xs uppercase">Suporte Humanizado</h4>
                  <p className="text-[11px] text-gray-600 mt-0.5">Atendimento personalizado pelo WhatsApp para tirar todas as dúvidas.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-[4px]">
                <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900 text-xs uppercase">Preço Competitivo</h4>
                  <p className="text-[11px] text-gray-600 mt-0.5">As melhores condições de pagamento com parcelamento em até 12x.</p>
                </div>
              </div>

            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 text-center">
            <p className="text-sm font-semibold text-gray-800 mb-4">
              Explore nossa loja agora e descubra por que milhares de clientes confiam na Imporshopp!
            </p>
            <Link to="/produtos" className="btn-primary text-xs uppercase px-8 py-3 shadow-md">
              Ver Todos os Produtos
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};
