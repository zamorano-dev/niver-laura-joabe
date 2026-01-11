import Link from "next/link";
import type { CSSProperties } from "react";
import { ImageCarousel } from "@/components/ImageCarousel";
import { getActiveProducts } from "@/lib/products";
import { TAG_LABELS } from "@/lib/constants";
import { formatParcelamento, formatPriceBRL } from "@/lib/format";

export default async function Home() {
  const products = await getActiveProducts();

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <div className="brand">
            <div className="brand-mark">LJ</div>
            <div>
              <div className="brand-title">Loja do Aniversário</div>
              <div className="brand-subtitle">Laura Ludovica & Joabe Lincoln</div>
            </div>
          </div>
          <div className="brand-subtitle">
            Santa Catarina • Familiares em Boa Vista - RR
          </div>
        </header>

        <section className="hero">
          <h1 className="hero-title">
            Aniversário da Laura Ludovica e do Joabe Lincoln
          </h1>
          <p>
            Um marketplace de presentes pensado para reunir carinho, tecnologia
            e a história da nossa família. Escolha um presente e veja as
            condições de pagamento.
          </p>
          <div className="hero-meta">
            <span className="hero-chip">Loja de presentes oficial</span>
            <span>Pagamento online seguro</span>
          </div>
        </section>

        <h2 className="section-title">Escolha um presente</h2>
        <div className="product-grid">
          {products.map((product, index) => (
            <Link
              key={product.id}
              href={`/produto/${product.slug}`}
              className="link-card"
            >
              <article
                className="product-card"
                style={{ "--delay": `${index * 80}ms` } as CSSProperties}
              >
                <div className="product-image">
                  <ImageCarousel
                    images={product.imagens}
                    alt={product.nome}
                    className="carousel--compact"
                  />
                </div>
                <div className="product-meta">
                  <span className="badge" data-tag={product.tagCrianca}>
                    {TAG_LABELS[product.tagCrianca]}
                  </span>
                  <h3 className="product-title">{product.nome}</h3>
                  <span className="product-price">
                    {formatPriceBRL(product.preco)}
                  </span>
                  <span className="helper">{formatParcelamento()}</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
