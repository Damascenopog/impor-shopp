import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, RefreshCw, AlertCircle, HelpCircle } from 'lucide-react';

export const ReturnsPage = () => {
  return (
    <div className="min-h-screen pb-16">
      
      {/* Header */}
      <div className="bg-neutral-900 text-white py-6 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            <span>/</span>
            <span className="text-white font-medium">Trocas e Devoluções</span>
          </div>
          <h1 className="text-2xl font-extrabold uppercase tracking-wide">
            Trocas e Devoluções
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Nossa política foi criada para ser clara, eficiente e amigável ao cliente.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-[4px] border border-gray-100 p-6 sm:p-10 shadow-xs space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
          
          <div className="border-b border-gray-100 pb-4">
            <h2 className="font-extrabold text-base uppercase text-gray-900 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              Política de Trocas e Devoluções
            </h2>
            <p>
              Na ImporShopp, queremos garantir que sua experiência de compra seja excepcional em todos os aspectos, incluindo trocas e devoluções. Nossa política foi criada para ser transparente, ágil e em total conformidade com o Código de Defesa do Consumidor.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-sm text-gray-900 mb-1">1. Período de Devolução e Arrependimento</h3>
            <p>
              Você tem até <strong>30 dias</strong> a partir da data de entrega para devolver itens adquiridos em nossa loja. Isso lhe dá tempo suficiente para examinar o produto e decidir com total tranquilidade.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-sm text-gray-900 mb-1">2. Condições para Devolução</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mt-1">
              <li>Os itens devolvidos devem estar em sua embalagem original, sem sinais de mau uso ou danos físicos provocados por terceiros.</li>
              <li>Acessórios, cabos, manuais e etiquetas originais devem estar intactos.</li>
              <li>Acompanhado do comprovante de compra ou número do pedido.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm text-gray-900 mb-1">3. Como Solicitar a Troca ou Devolução</h3>
            <p>
              Basta entrar em contato com nosso atendimento via WhatsApp no <strong>(21) 97289-3879</strong> informando o número do seu pedido e o motivo. Nossa equipe emitirá a autorização de postagem reversa sem custo de frete para o cliente.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-sm text-gray-900 mb-1">4. Reembolso e Estorno</h3>
            <p>
              Assim que o produto chegar ao nosso centro de distribuição e passar pela conferência técnica, o reembolso será processado imediatamente na mesma modalidade de pagamento utilizada na compra (Pix imediato ou estorno no cartão em até 7 dias úteis).
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
