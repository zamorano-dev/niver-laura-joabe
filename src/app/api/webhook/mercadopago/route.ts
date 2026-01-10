import { NextResponse } from "next/server";
import {
  updateProductPaid,
  updateProductPaidBySlug,
} from "@/lib/products";

export const runtime = "nodejs";

type WebhookPayload = {
  productId?: string;
  slug?: string;
  external_reference?: string;
  paid?: boolean;
  status?: string;
  payment_status?: string;
  data?: {
    productId?: string;
    slug?: string;
    status?: string;
  };
  metadata?: {
    productId?: string;
    slug?: string;
  };
};

function isPaidPayload(payload: WebhookPayload, fallbackPaid?: string | null) {
  if (typeof payload.paid === "boolean") {
    return payload.paid;
  }

  const status =
    payload.status || payload.payment_status || payload.data?.status || "";
  if (status) {
    return status === "approved" || status === "paid";
  }

  if (fallbackPaid) {
    return fallbackPaid === "true" || fallbackPaid === "1";
  }

  return false;
}

function getIdentifiers(
  payload: WebhookPayload,
  query: URLSearchParams
): { id?: string; slug?: string } {
  const id =
    payload.productId ||
    payload.data?.productId ||
    payload.metadata?.productId ||
    query.get("productId") ||
    undefined;
  const slug =
    payload.slug ||
    payload.data?.slug ||
    payload.metadata?.slug ||
    payload.external_reference ||
    query.get("slug") ||
    query.get("external_reference") ||
    undefined;

  return { id, slug };
}

export async function POST(request: Request) {
  const secret = process.env.WEBHOOK_SECRET;
  if (secret) {
    const provided = request.headers.get("x-webhook-secret");
    if (!provided || provided !== secret) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  }

  const url = new URL(request.url);
  let payload: WebhookPayload = {};

  try {
    payload = (await request.json()) as WebhookPayload;
  } catch {
    payload = {};
  }

  const { id, slug } = getIdentifiers(payload, url.searchParams);
  if (!id && !slug) {
    return NextResponse.json(
      { ok: false, error: "missing_product_identifier" },
      { status: 400 }
    );
  }

  const paid = isPaidPayload(payload, url.searchParams.get("paid"));
  if (!paid) {
    return NextResponse.json({ ok: true, paid: false }, { status: 202 });
  }

  const updated = id
    ? await updateProductPaid(id, true)
    : await updateProductPaidBySlug(slug as string, true);

  if (!updated) {
    return NextResponse.json({ ok: false, error: "product_not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, paid: true, id: updated.id });
}
