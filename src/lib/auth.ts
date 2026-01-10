import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "admin_session";

function normalizeCpf(value: string) {
  return value.replace(/\D/g, "");
}

function getSecret() {
  return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "dev-secret";
}

export function getAdminCredentials() {
  const cpf = process.env.ADMIN_CPF;
  const password = process.env.ADMIN_PASSWORD;

  if (!cpf || !password) {
    return null;
  }

  return {
    cpf: normalizeCpf(cpf),
    password,
  };
}

export function validateAdminCredentials(cpf: string, password: string) {
  const credentials = getAdminCredentials();
  if (!credentials) {
    return false;
  }

  return normalizeCpf(cpf) === credentials.cpf && password === credentials.password;
}

function signSession(cpf: string) {
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(cpf)
    .digest("hex");

  return `${cpf}.${signature}`;
}

function isValidSession(value: string) {
  const [cpf, signature] = value.split(".");
  if (!cpf || !signature) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", getSecret())
    .update(cpf)
    .digest("hex");

  const left = Buffer.from(signature);
  const right = Buffer.from(expected);

  if (left.length !== right.length) {
    return false;
  }

  const credentials = getAdminCredentials();
  if (!credentials || cpf !== credentials.cpf) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

export function createAdminSession(cpf: string) {
  cookies().set(COOKIE_NAME, signSession(normalizeCpf(cpf)), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export function clearAdminSession() {
  cookies().delete(COOKIE_NAME);
}

export function isAdminAuthenticated() {
  const session = cookies().get(COOKIE_NAME)?.value;
  if (!session) {
    return false;
  }

  return isValidSession(session);
}

export function requireAdmin() {
  if (!isAdminAuthenticated()) {
    redirect("/admin");
  }
}
