import React, { useState } from 'react';
import { Truck, RotateCw, ExternalLink } from 'lucide-react';
import { TruckIcon } from '../common/Icons';
import { simulateShipping, formatPrice } from '../../utils/formatters';

export const ShippingCalculator = ({ price }) => {
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError('');
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      setError('Não conseguimos encontrar esse CEP. Está bem escrito?');
      return;
    }

    try {
      setLoading(true);
      const options = await simulateShipping(cleanCep, price);
      setResults(options);
    } catch (err) {
      setError(err.message || 'Erro no cálculo. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50/80 border border-gray-200/70 rounded-[4px] p-4 sm:p-5 my-4">
      <div className="flex items-center gap-2 mb-3">
        <TruckIcon className="w-5 h-5 text-gray-700" />
        <span className="font-bold text-xs uppercase tracking-wider text-gray-800">
          Meios de envio
        </span>
      </div>

      <form onSubmit={handleCalculate} className="flex gap-2">
        <input
          type="text"
          maxLength={9}
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          placeholder="Seu CEP"
          className="flex-1 bg-white border border-gray-300 rounded-[4px] px-3.5 py-2.5 text-xs text-gray-800 placeholder:text-gray-400 focus:border-black focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black hover:bg-neutral-800 text-white font-bold text-xs px-5 py-2.5 rounded-[4px] transition-colors flex items-center gap-2 uppercase tracking-wide shrink-0"
        >
          {loading ? (
            <>
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
              <span>Calculando...</span>
            </>
          ) : (
            'Calcular'
          )}
        </button>
      </form>

      <div className="mt-2 flex items-center justify-between">
        <a
          href="https://buscacepinter.correios.com.br/app/endereco/index.php"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-gray-500 hover:text-black underline inline-flex items-center gap-1"
        >
          <span>Não sei meu CEP</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>

      {error && (
        <div className="mt-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[4px]">
          {error}
        </div>
      )}

      {/* Results List */}
      {results && results.length > 0 && (
        <div className="mt-3.5 pt-3 border-t border-gray-200/80 space-y-2">
          {results.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-[4px] text-xs shadow-2xs"
            >
              <div>
                <p className="font-bold text-gray-800">{item.name}</p>
                <p className="text-[11px] text-gray-500">Prazo: {item.days}</p>
              </div>
              <div>
                {item.isFree ? (
                  <span className="text-xs font-extrabold text-green-600 uppercase bg-green-50 px-2 py-0.5 rounded">
                    Grátis
                  </span>
                ) : (
                  <span className="text-xs font-bold text-gray-900">
                    {formatPrice(item.price)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
