/* eslint-disable @next/next/no-img-element */

"use client";

import { useState } from "react";

type ImageCarouselProps = {
  images: string[];
  alt: string;
  className?: string;
};

const fallbackImage = "/images/produto-casinha.svg";

export function ImageCarousel({ images, alt, className }: ImageCarouselProps) {
  const safeImages = images.length ? images : [fallbackImage];
  const [index, setIndex] = useState(0);
  const total = safeImages.length;

  const goTo = (nextIndex: number) => {
    const normalized = (nextIndex + total) % total;
    setIndex(normalized);
  };

  const goNext = () => goTo(index + 1);
  const goPrev = () => goTo(index - 1);

  return (
    <div
      className={["carousel", className].filter(Boolean).join(" ")}
      aria-roledescription="carousel"
      aria-label={`Imagens de ${alt}`}
    >
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {safeImages.map((src, imageIndex) => (
          <div className="carousel-slide" key={`${src}-${imageIndex}`}>
            <img src={src} alt={`${alt} - imagem ${imageIndex + 1}`} />
          </div>
        ))}
      </div>

      {total > 1 ? (
        <>
          <button
            className="carousel-btn carousel-btn-prev"
            type="button"
            onClick={goPrev}
            aria-label="Imagem anterior"
          >
            ‹
          </button>
          <button
            className="carousel-btn carousel-btn-next"
            type="button"
            onClick={goNext}
            aria-label="Proxima imagem"
          >
            ›
          </button>
          <div className="carousel-dots" role="tablist">
            {safeImages.map((_, dotIndex) => (
              <button
                key={`dot-${dotIndex}`}
                className={
                  dotIndex === index
                    ? "carousel-dot is-active"
                    : "carousel-dot"
                }
                type="button"
                onClick={() => goTo(dotIndex)}
                aria-label={`Ir para imagem ${dotIndex + 1}`}
                aria-selected={dotIndex === index}
                role="tab"
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
