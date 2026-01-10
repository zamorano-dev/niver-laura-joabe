export type ProductTag = "LAURA_LUDOVICA" | "JOABE_LINCOLN" | "COMPARTILHADO";

export type Product = {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  preco: number;
  tagCrianca: ProductTag;
  imagens: string[];
  paymentLink: string;
  ativo: boolean;
  pago: boolean;
};
