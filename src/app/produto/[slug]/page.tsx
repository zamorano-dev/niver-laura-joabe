/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageCarousel } from "@/components/ImageCarousel";
import { TAG_LABELS, TAG_RECIPIENT_COPY } from "@/lib/constants";
import { getChildPhotos } from "@/lib/childPhotos";
import { formatParcelamento, formatPriceBRL } from "@/lib/format";
import { getProductBySlug } from "@/lib/products";

export const dynamic = "force-dynamic";

type ProdutoPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProdutoPage({ params }: ProdutoPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.ativo || product.pago) {
    notFound();
  }

  const childPhotos = await getChildPhotos();
  const childPhoto = childPhotos[product.tagCrianca];
  const productImages = product.imagens.length
    ? product.imagens
    : ["/images/produto-casinha.svg"];

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <Link href="/" className="brand">
            <div className="brand-mark">LJ</div>
            <div>
              <div className="brand-title">Loja do Aniversário</div>
              <div className="brand-subtitle">Laura Ludovica & Joabe Lincoln</div>
            </div>
          </Link>
          <Link className="btn btn-secondary" href="/">
            Voltar para a loja
          </Link>
        </header>

        <div className="product-layout">
          <div className="gallery">
            <div>
              <h2 className="section-title">Fotos do produto</h2>
              <div className="gallery-item">
                <ImageCarousel images={productImages} alt={product.nome} />
              </div>
            </div>

            <section>
              <h2 className="section-title">Quem vai receber este presente</h2>
              <div className="recipient-card">
                <img
                  className="recipient-photo"
                  src={childPhoto}
                  alt={TAG_LABELS[product.tagCrianca]}
                />
                <p>{TAG_RECIPIENT_COPY[product.tagCrianca]}</p>
              </div>
            </section>

            <section>
              <h2 className="section-title">Descrição do presente</h2>
              <div className="description-card">
                <p>{product.descricao}</p>
              </div>
            </section>
          </div>

          <aside className="product-details">
            <span className="badge" data-tag={product.tagCrianca}>
              {TAG_LABELS[product.tagCrianca]}
            </span>
            <h1>{product.nome}</h1>
            <div className="product-price">{formatPriceBRL(product.preco)}</div>
            <div className="callout">Parcelamento {formatParcelamento()}</div>
            <a className="btn" href={product.paymentLink}>
              Comprar este presente
            </a>
          </aside>
        </div>
      </div>
    </div>
  );
}
