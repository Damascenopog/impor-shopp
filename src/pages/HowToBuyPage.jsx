import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, MousePointerClick, Truck, CreditCard, CheckCircle, Package } from 'lucide-react';

export const HowToBuyPage = () => {
  const steps = [
    {
      num: 1,
      title: "Escolha o Produto",
      desc: "Navegue pelas nossas categorias ou utilize a barra de busca para encontrar o item desejado."
    },
    {
      num: 2,
      title: "Selecione Cor e Quantidade",
      desc: "Na página do produto, selecione a cor ou variação de sua preferência e defina a quantidade."
    },
    {
      num: 3,
      title: "Adicione ao Carrinho",
      desc: "Clique no botão 'Comprar' para incluir o item em seu carrinho de compras."
    },
    {
      num: 4,
      title: "Simule o Frete",
      desc: "Digite seu CEP para conferir as opções de entrega e prazos disponíveis para sua região."
    },
    {
      num: 5,
      title: "Inicie a Compra",
      desc: "No carrinho, clique em 'Iniciar Compra' para avançar para a identificação segura."
    },
    {
      num: 6,
      title: "Informe o Endereço de Entrega",
      desc: "Preencha seus dados de contato e o endereço completo onde deseja receber sua encomenda."
    },
    {
      num: 7,
      title: "Escolha a Forma de Pagamento",
      desc: "Pague com Pix (aprovação imediata), Cartão de Crédito em até 12x ou Boleto Bancário."
    },
    {
      num: 8,
      title: "Confirme o Pedido",
      desc: "Revise todos os dados e clique em finalizar. Você receberá um e-mail com a confirmação."
    },
    {
      num: 9,
      title: "Receba seu Rastreamento",
      desc: "Assim que o pagamento for aprovado, seu pedido será embalado e despachado com código de rastreio!"
    }
  ];

  return (
    <div className="min-h-screen pb-16">
      
      {/* Header */}
      <div className="bg-neutral-900 text-white py-6 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            <span>/</span>
            <span className="text-white font-medium">Como Comprar</span>
          </div>
          <h1 className="text-2xl font-extrabold uppercase tracking-wide">
            Como Comprar na Imporshopp
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Passo a passo simples e seguro para realizar suas compras online.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-[4px] border border-gray-100 p-6 sm:p-8 shadow-xs">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="p-4 rounded-[4px] border border-gray-100 bg-gray-50/50 hover:bg-red-50/30 hover:border-[#f20606] transition-all relative group"
              >
                <span className="w-8 h-8 rounded-full bg-[#f20606] text-white font-extrabold text-xs flex items-center justify-center mb-3 shadow-xs">
                  {step.num}
                </span>
                <h3 className="font-bold text-xs sm:text-sm text-gray-900 uppercase mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <Link to="/produtos" className="btn-primary text-xs uppercase px-8 py-3.5 shadow-md">
              Explorar Catálogo Agora
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};
