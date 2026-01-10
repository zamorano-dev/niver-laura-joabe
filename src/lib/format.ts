import { PARCELAS_PADRAO } from "./constants";

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatPriceBRL(value: number) {
  return priceFormatter.format(value);
}

export function formatParcelamento(parcela = PARCELAS_PADRAO) {
  return `em até ${parcela} vezes (juros inclusos)`;
}
