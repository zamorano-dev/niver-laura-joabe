"use server";

import { redirect } from "next/navigation";
import {
  createProduct,
  deleteProduct,
  parseProductFormData,
  updateProduct,
} from "@/lib/products";
import {
  clearAdminSession,
  createAdminSession,
  requireAdmin,
  validateAdminCredentials,
} from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const cpf = String(formData.get("cpf") || "");
  const senha = String(formData.get("senha") || "");

  if (!cpf || !senha) {
    redirect("/admin?error=missing");
  }

  if (!validateAdminCredentials(cpf, senha)) {
    redirect("/admin?error=invalid");
  }

  createAdminSession(cpf);
  redirect("/admin");
}

export async function logoutAction() {
  clearAdminSession();
  redirect("/admin");
}

export async function createProductAction(formData: FormData) {
  requireAdmin();
  const input = parseProductFormData(formData);
  await createProduct(input);
  redirect("/admin");
}

export async function updateProductAction(id: string, formData: FormData) {
  requireAdmin();
  const input = parseProductFormData(formData);
  await updateProduct(id, input);
  redirect("/admin");
}

export async function deleteProductAction(id: string) {
  requireAdmin();
  await deleteProduct(id);
  redirect("/admin");
}
