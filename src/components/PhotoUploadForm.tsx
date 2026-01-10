/* eslint-disable @next/next/no-img-element */

"use client";

import { useMemo, useState } from "react";
import { updateChildPhotosAction } from "@/app/admin/actions";
import { TAG_LABELS } from "@/lib/constants";
import type { ChildPhotoMap } from "@/lib/childPhotos";
import type { ProductTag } from "@/lib/types";

const TARGET_SIZE = 720;
const JPEG_QUALITY = 0.78;

type PhotoUploadFormProps = {
  photos: ChildPhotoMap;
};

type PreviewState = Record<ProductTag, string>;

type ErrorState = Partial<Record<ProductTag, string>>;

async function cropAndCompress(file: File) {
  const imageUrl = URL.createObjectURL(file);
  const img = new Image();

  try {
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Nao foi possivel ler a imagem."));
      img.src = imageUrl;
    });

    const minSide = Math.min(img.naturalWidth, img.naturalHeight);
    const offsetX = (img.naturalWidth - minSide) / 2;
    const offsetY = (img.naturalHeight - minSide) / 2;

    const canvas = document.createElement("canvas");
    canvas.width = TARGET_SIZE;
    canvas.height = TARGET_SIZE;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Nao foi possivel preparar o recorte.");
    }

    ctx.drawImage(
      img,
      offsetX,
      offsetY,
      minSide,
      minSide,
      0,
      0,
      TARGET_SIZE,
      TARGET_SIZE
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

export function PhotoUploadForm({ photos }: PhotoUploadFormProps) {
  const [previews, setPreviews] = useState<PreviewState>({
    LAURA_LUDOVICA: photos.LAURA_LUDOVICA,
    JOABE_LINCOLN: photos.JOABE_LINCOLN,
    COMPARTILHADO: photos.COMPARTILHADO,
  });
  const [errors, setErrors] = useState<ErrorState>({});

  const fileFields = useMemo(
    () => [
      { tag: "LAURA_LUDOVICA" as const, id: "fotoLaura", label: "Foto da Laura" },
      { tag: "JOABE_LINCOLN" as const, id: "fotoJoabe", label: "Foto do Joabe" },
      {
        tag: "COMPARTILHADO" as const,
        id: "fotoCompartilhado",
        label: "Foto compartilhada",
      },
    ],
    []
  );

  const handleFile = async (
    tag: ProductTag,
    input: HTMLInputElement | null
  ) => {
    if (!input?.files?.length) {
      return;
    }

    const file = input.files[0];

    try {
      setErrors((prev) => ({ ...prev, [tag]: undefined }));
      const processed = await cropAndCompress(file);
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(processed);
      input.files = dataTransfer.files;
      setPreviews((prev) => ({
        ...prev,
        [tag]: URL.createObjectURL(processed),
      }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [tag]: (error as Error).message,
      }));
    }
  };

  return (
    <form action={updateChildPhotosAction}>
      <div className="photo-grid">
        {fileFields.map((field) => (
          <div key={field.tag} className="photo-card">
            <img
              className="photo-preview"
              src={previews[field.tag]}
              alt={TAG_LABELS[field.tag]}
            />
            <label htmlFor={field.id}>{field.label}</label>
            <input
              id={field.id}
              name={field.id}
              type="file"
              accept="image/*"
              onChange={(event) =>
                handleFile(field.tag, event.currentTarget as HTMLInputElement)
              }
            />
            <p className="helper">{TAG_LABELS[field.tag]}</p>
            {errors[field.tag] ? (
              <p className="helper">{errors[field.tag]}</p>
            ) : (
              <p className="helper">Auto recorte em formato quadrado.</p>
            )}
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button className="btn" type="submit">
          Salvar fotos
        </button>
      </div>
    </form>
  );
}
