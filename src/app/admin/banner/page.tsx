import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getBanner } from "@/lib/banner";
import { BannerUploadForm } from "@/components/BannerUploadForm";

type BannerPageProps = {
  searchParams?: Promise<{ saved?: string }>;
};

export default async function BannerPage({ searchParams }: BannerPageProps) {
  await requireAdmin();
  const resolvedSearchParams = await searchParams;
  const banner = await getBanner();
  const saved = resolvedSearchParams?.saved === "true";

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <Link href="/admin" className="brand">
            <div className="brand-mark">LJ</div>
            <div>
              <div className="brand-title">Painel admin</div>
              <div className="brand-subtitle">Banner da loja</div>
            </div>
          </Link>
          <Link className="btn btn-secondary" href="/admin">
            Voltar
          </Link>
        </header>

        <div className="admin-shell">
          <h1>Banner da loja</h1>
          <p className="helper">
            Um destaque visual para as criancas com uma imagem ampla e harmonizada.
          </p>
          {saved ? <p className="helper">Banner atualizado com sucesso.</p> : null}

          <BannerUploadForm banner={banner} />
        </div>
      </div>
    </div>
  );
}
