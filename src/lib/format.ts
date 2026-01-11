

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatPriceBRL(value: number) {
  return priceFormatter.format(value);
}

export function formatParcelamento() {
  return `disponível`;
};
