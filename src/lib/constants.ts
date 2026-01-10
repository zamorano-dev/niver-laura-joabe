import { ProductTag } from "./types";

export const TAG_LABELS: Record<ProductTag, string> = {
  LAURA_LUDOVICA: "Presente da Laura Ludovica (4 anos)",
  JOABE_LINCOLN: "Presente do Joabe Lincoln (1 ano)",
  COMPARTILHADO: "Presente para Laura e Joabe",
};

export const PARCELAS_PADRAO = 10;

export const DEFAULT_CHILD_PHOTOS: Record<ProductTag, string> = {
  LAURA_LUDOVICA: "/images/crianca-laura.svg",
  JOABE_LINCOLN: "/images/crianca-joabe.svg",
  COMPARTILHADO: "/images/crianca-compartilhado.svg",
};

export const TAG_RECIPIENT_COPY: Record<ProductTag, string> = {
  LAURA_LUDOVICA:
    "Este presente e para a Laura Ludovica, 4 anos de alegria e imaginação. Um carinho escolhido para ver o sorriso dela brilhar ainda mais.",
  JOABE_LINCOLN:
    "Este presente e para o Joabe Lincoln, 1 aninho de descobertas. Um gesto de afeto que acompanha cada passo dessa fase tao especial.",
  COMPARTILHADO:
    "Este presente e para a Laura e o Joabe, irmaos que comemoram juntos. Um momento para viver, brincar e guardar na memoria da familia.",
};
