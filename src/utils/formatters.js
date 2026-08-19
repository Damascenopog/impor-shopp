export const formatPrice = (value) => {
  if (value === null || value === undefined) return '';
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const calculateInstallments = (price, count = 12) => {
  const installmentValue = price / count;
  return {
    count,
    value: installmentValue,
    formatted: `Ou até ${count}x de ${formatPrice(installmentValue)}`
  };
};

export const simulateShipping = async (cep, subtotal = 0) => {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) {
    throw new Error('CEP inválido. Digite 8 dígitos.');
  }

  // Artificial short delay for realistic feeling
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Determine state based on initial digits (approximate for realism)
  const isRioOrSP = ['0', '1', '2'].includes(cleanCep[0]);
  const isFree = subtotal >= 199;

  const pacCost = isFree ? 0 : (isRioOrSP ? 18.90 : 28.50);
  const sedexCost = isRioOrSP ? 27.90 : 45.00;
  const transportadoraCost = isFree ? 0 : (isRioOrSP ? 14.50 : 22.90);

  return [
    {
      id: 'transportadora',
      name: 'Melhor Envio (Transportadora)',
      price: transportadoraCost,
      isFree: transportadoraCost === 0,
      days: isRioOrSP ? '2 a 4 dias úteis' : '4 a 7 dias úteis'
    },
    {
      id: 'correios-pac',
      name: 'Correios PAC',
      price: pacCost,
      isFree: pacCost === 0,
      days: isRioOrSP ? '3 a 5 dias úteis' : '6 a 9 dias úteis'
    },
    {
      id: 'correios-sedex',
      name: 'Correios SEDEX (Expresso)',
      price: sedexCost,
      isFree: false,
      days: isRioOrSP ? '1 a 2 dias úteis' : '2 a 4 dias úteis'
    }
  ];
};
