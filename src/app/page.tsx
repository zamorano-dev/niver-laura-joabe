/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import type { CSSProperties } from "react";
import { ImageCarousel } from "@/components/ImageCarousel";
import { getActiveProducts } from "@/lib/products";
import { TAG_LABELS } from "@/lib/constants";
import { getBanner } from "@/lib/banner";
import { formatParcelamento, formatPriceBRL } from "@/lib/format";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams?: Promise<{ shop?: string }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const products = await getActiveProducts();
  const banner = await getBanner();
  const resolvedSearchParams = await searchParams;
  const shop = resolvedSearchParams?.shop;

  const filteredProducts =
    shop === "laura"
      ? products.filter(
          (product) =>
            product.tagCrianca === "LAURA_LUDOVICA" ||
            product.tagCrianca === "COMPARTILHADO"
        )
      : shop === "joabe"
        ? products.filter(
            (product) =>
              product.tagCrianca === "JOABE_LINCOLN" ||
              product.tagCrianca === "COMPARTILHADO"
          )
        : products;

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
            condições de parcelamento já inclusas.
          </p>
          <div className="hero-meta">
            <span className="hero-chip">Loja de presentes oficial</span>
            <span>Parcelamento incluso no valor</span>
          </div>
        </section>

        {banner.enabled ? (
          <section className="banner">
            <div className="banner-media">
              <img src={banner.image} alt={banner.title} />
              <div className="banner-overlay" />
              <div className="banner-content">
                <span className="banner-chip">Especial para a familia</span>
                <h2>{banner.title}</h2>
                <p>{banner.subtitle}</p>
              </div>
            </div>
          </section>
        ) : null}

        <section className="shop-divider">
          <div className="shop-divider-card">
            <div>
              <span className="shop-divider-chip">Escolha por loja</span>
              <h2>Loja da Laura ou loja do Joabe?</h2>
              <p>
                Navegue pelos presentes pensados para cada crianca. Presentes
                compartilhados aparecem nas duas lojas.
              </p>
            </div>
            <div className="shop-divider-actions">
              <Link
                className={
                  shop === "laura"
                    ? "btn btn-secondary is-active"
                    : "btn btn-secondary"
                }
                href="/?shop=laura"
              >
                Loja da Laurinha
              </Link>
              <Link
                className={
                  shop === "joabe"
                    ? "btn btn-secondary is-active"
                    : "btn btn-secondary"
                }
                href="/?shop=joabe"
              >
                Loja do Joabe
              </Link>
              <Link className="btn" href="/">
                Ver todos
              </Link>
            </div>
          </div>
        </section>

        <h2 className="section-title">Escolha um presente</h2>
        <div className="product-grid">
          {filteredProducts.map((product, index) => (
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
