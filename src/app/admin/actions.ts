"use server";

import { redirect } from "next/navigation";
import {
  createProduct,
  deleteProduct,
  parseProductFormData,
  updateProductPaid,
  updateProduct,
} from "@/lib/products";
import {
  clearAdminSession,
  createAdminSession,
  requireAdmin,
  validateAdminCredentials,
} from "@/lib/auth";
import {
  getChildPhotos,
  saveChildPhoto,
  saveChildPhotos,
} from "@/lib/childPhotos";
import { ProductTag } from "@/lib/types";
import { getBanner, saveBanner, saveBannerImage } from "@/lib/banner";

export async function loginAction(formData: FormData) {
  const cpf = String(formData.get("cpf") || "");
  const senha = String(formData.get("senha") || "");

  if (!cpf || !senha) {
    redirect("/admin?error=missing");
  }

  if (!validateAdminCredentials(cpf, senha)) {
    redirect("/admin?error=invalid");
  }

  await createAdminSession(cpf);
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin");
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  const input = parseProductFormData(formData);
  await createProduct(input);
  redirect("/admin");
}

export async function updateProductAction(id: string, formData: FormData) {
  await requireAdmin();
  const input = parseProductFormData(formData);
  await updateProduct(id, input);
  redirect("/admin");
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  await deleteProduct(id);
  redirect("/admin");
}

export async function updatePaidStatusAction(id: string, pago: boolean) {
  await requireAdmin();
  await updateProductPaid(id, pago);
  redirect(pago ? "/admin?tab=paid" : "/admin");
}

export async function updateChildPhotosAction(formData: FormData) {
  await requireAdmin();

  const current = await getChildPhotos();
  const next = { ...current };

  const fileEntries: Array<[ProductTag, string]> = [
    ["LAURA_LUDOVICA", "fotoLaura"],
    ["JOABE_LINCOLN", "fotoJoabe"],
    ["COMPARTILHADO", "fotoCompartilhado"],
  ];

  for (const [tag, fieldName] of fileEntries) {
    const file = formData.get(fieldName);
    if (file instanceof File && file.size > 0) {
      next[tag] = await saveChildPhoto(tag, file);
    }
  }

  await saveChildPhotos(next);
  redirect("/admin/fotos?saved=true");
}

export async function updateBannerAction(formData: FormData) {
  await requireAdmin();

  const current = await getBanner();
  const title = String(formData.get("title") || "");
  const subtitle = String(formData.get("subtitle") || "");
  const enabled = formData.get("enabled") === "on";

  const file = formData.get("image");
  const image =
    file instanceof File && file.size > 0
      ? await saveBannerImage(file)
      : current.image;

  await saveBanner({
    title,
    subtitle,
    image,
    enabled,
  });

  redirect("/admin/banner?saved=true");
}
