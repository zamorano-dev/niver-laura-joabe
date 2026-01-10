import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { Product, ProductTag } from "./types";
import { toSlug } from "./slug";

export type ProductInput = Omit<Product, "id">;

const dataFile = path.join(process.cwd(), "src", "data", "products.json");
const validTags: ProductTag[] = [
  "LAURA_LUDOVICA",
  "JOABE_LINCOLN",
  "COMPARTILHADO",
];

function isValidTag(value: string): value is ProductTag {
  return validTags.includes(value as ProductTag);
}

function parsePrice(value: string) {
  const trimmed = value.trim();
  const normalized = trimmed.includes(",")
    ? trimmed.replace(/\./g, "").replace(",", ".")
    : trimmed;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseImages(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function ensureUniqueSlug(
  products: Product[],
  slug: string,
  excludeId?: string
) {
  let unique = slug || "presente";
  let counter = 2;

  while (products.some((item) => item.slug === unique && item.id !== excludeId)) {
    unique = `${slug}-${counter}`;
    counter += 1;
  }

  return unique;
}

async function readProducts() {
  try {
    const raw = await fs.readFile(dataFile, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? (data as Product[]) : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function writeProducts(products: Product[]) {
  await fs.writeFile(dataFile, `${JSON.stringify(products, null, 2)}\n`, "utf8");
}

export async function getProducts() {
  return readProducts();
}

export async function getActiveProducts() {
  const products = await readProducts();
  return products.filter((product) => product.ativo && !product.pago);
}

export async function getProductBySlug(slug: string) {
  const products = await readProducts();
  return products.find((product) => product.slug === slug);
}

export async function getProductById(id: string) {
  const products = await readProducts();
  return products.find((product) => product.id === id);
}

export async function createProduct(input: ProductInput) {
  const products = await readProducts();
  const baseSlug = toSlug(input.slug || input.nome || "presente");
  const slug = ensureUniqueSlug(products, baseSlug);

  const newProduct: Product = {
    id: crypto.randomUUID(),
    ...input,
    slug,
  };

  products.unshift(newProduct);
  await writeProducts(products);
  return newProduct;
}

export async function updateProduct(id: string, input: ProductInput) {
  const products = await readProducts();
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    return null;
  }

  const baseSlug = toSlug(input.slug || input.nome || "presente");
  const slug = ensureUniqueSlug(products, baseSlug, id);

  const updated: Product = {
    ...products[index],
    ...input,
    slug,
  };

  products[index] = updated;
  await writeProducts(products);
  return updated;
}

export async function deleteProduct(id: string) {
  const products = await readProducts();
  const next = products.filter((product) => product.id !== id);
  await writeProducts(next);
}

export async function updateProductPaid(id: string, pago: boolean) {
  const products = await readProducts();
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    return null;
  }

  products[index] = {
    ...products[index],
    pago,
  };

  await writeProducts(products);
  return products[index];
}

export async function updateProductPaidBySlug(slug: string, pago: boolean) {
  const products = await readProducts();
  const index = products.findIndex((product) => product.slug === slug);

  if (index === -1) {
    return null;
  }

  products[index] = {
    ...products[index],
    pago,
  };

  await writeProducts(products);
  return products[index];
}

export function parseProductFormData(formData: FormData): ProductInput {
  const nome = String(formData.get("nome") || "").trim();
  const slug = String(formData.get("slug") || "").trim();
  const descricao = String(formData.get("descricao") || "").trim();
  const precoRaw = String(formData.get("preco") || "0");
  const tagRaw = String(formData.get("tagCrianca") || "");
  const imagensRaw = String(formData.get("imagens") || "");
  const paymentLink = String(formData.get("paymentLink") || "").trim();
  const ativo = formData.get("ativo") === "on";
  const pago = formData.get("pago") === "on";

  return {
    nome,
    slug,
    descricao,
    preco: parsePrice(precoRaw),
    tagCrianca: isValidTag(tagRaw) ? tagRaw : "COMPARTILHADO",
    imagens: parseImages(imagensRaw),
    paymentLink,
    ativo,
    pago,
  };
}
