import { ProductTag } from "./types";

export const TAG_LABELS: Record<ProductTag, string> = {
  LAURA_LUDOVICA: "Presente da Laura Ludovica (4 anos)",
  JOABE_LINCOLN: "Presente do Joabe Lincoln (1 ano)",
  COMPARTILHADO: "Presente para Laura e Joabe",
};

export const PARCELAS_PADRAO = 10;

export const CHILD_GALLERY: Record<ProductTag, string[]> = {
  LAURA_LUDOVICA: ["/images/crianca-laura.svg"],
  JOABE_LINCOLN: ["/images/crianca-joabe.svg"],
  COMPARTILHADO: ["/images/crianca-laura.svg", "/images/crianca-joabe.svg"],
};
