/* eslint-disable @next/next/no-img-element */

"use client";

import { useMemo, useRef, useState } from "react";
import { updateBannerAction } from "@/app/admin/actions";
import type { BannerData } from "@/lib/banner";

const TARGET_WIDTH = 1600;
const TARGET_HEIGHT = 900;
const JPEG_QUALITY = 0.82;

async function cropBanner(file: File) {
  const imageUrl = URL.createObjectURL(file);
  const img = new Image();

  try {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Nao foi possivel ler a imagem."));
      img.src = imageUrl;
    });

    const targetRatio = TARGET_WIDTH / TARGET_HEIGHT;
    const sourceRatio = img.naturalWidth / img.naturalHeight;

    let cropWidth = img.naturalWidth;
    let cropHeight = img.naturalHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (sourceRatio > targetRatio) {
      cropWidth = img.naturalHeight * targetRatio;
      offsetX = (img.naturalWidth - cropWidth) / 2;
    } else {
      cropHeight = img.naturalWidth / targetRatio;
      offsetY = (img.naturalHeight - cropHeight) / 2;
    }

    const canvas = document.createElement("canvas");
    canvas.width = TARGET_WIDTH;
    canvas.height = TARGET_HEIGHT;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Nao foi possivel preparar o recorte.");
    }

    ctx.drawImage(
      img,
      offsetX,
      offsetY,
      cropWidth,
      cropHeight,
      0,
      0,
      TARGET_WIDTH,
      TARGET_HEIGHT
    );

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY);
    });

    if (!blob) {
      throw new Error("Nao foi possivel processar a imagem.");
    }

    const baseName = file.name.replace(/\.[^/.]+$/, "");
    return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

type BannerUploadFormProps = {
  banner: BannerData;
};

export function BannerUploadForm({ banner }: BannerUploadFormProps) {
  const [preview, setPreview] = useState(banner.image);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const defaultValues = useMemo(
    () => ({
      title: banner.title,
      subtitle: banner.subtitle,
      enabled: banner.enabled,
    }),
    [banner]
  );

  const handleFileChange = async () => {
    const input = fileInputRef.current;
    if (!input?.files?.length) {
      return;
    }

    const file = input.files[0];

    try {
      setError(null);
      const processed = await cropBanner(file);
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(processed);
      input.files = dataTransfer.files;
      setPreview(URL.createObjectURL(processed));
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <form action={updateBannerAction}>
      <div className="banner-form">
        <div className="banner-preview">
          <img src={preview} alt="Banner atual" />
        </div>
        <div className="form-grid">
          <div>
            <label htmlFor="title">Titulo do banner</label>
            <input
              id="title"
              name="title"
              type="text"
              defaultValue={defaultValues.title}
            />
          </div>
          <div>
            <label htmlFor="subtitle">Subtitulo</label>
            <textarea id="subtitle" name="subtitle" defaultValue={defaultValues.subtitle} />
          </div>
          <div>
            <label htmlFor="image">Imagem do banner</label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <p className="helper">Recorte automatico em 16:9.</p>
            {error ? <p className="helper">{error}</p> : null}
          </div>
          <div>
            <label htmlFor="enabled">Mostrar banner</label>
            <input
              id="enabled"
              name="enabled"
              type="checkbox"
              defaultChecked={defaultValues.enabled}
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn" type="submit">
          Salvar banner
        </button>
      </div>
    </form>
  );
}
