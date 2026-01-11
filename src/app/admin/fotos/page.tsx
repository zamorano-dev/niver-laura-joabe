import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getChildPhotos } from "@/lib/childPhotos";
import { PhotoUploadForm } from "@/components/PhotoUploadForm";

type FotosPageProps = {
  searchParams?: Promise<{ saved?: string }>;
};

export default async function FotosPage({ searchParams }: FotosPageProps) {
  await requireAdmin();
  const resolvedSearchParams = await searchParams;
  const photos = await getChildPhotos();
  const saved = resolvedSearchParams?.saved === "true";

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <Link href="/admin" className="brand">
            <div className="brand-mark">LJ</div>
            <div>
              <div className="brand-title">Painel admin</div>
              <div className="brand-subtitle">Fotos das criancas</div>
            </div>
          </Link>
          <Link className="btn btn-secondary" href="/admin">
            Voltar
          </Link>
        </header>

        <div className="admin-shell">
          <h1>Fotos das criancas</h1>
          <p className="helper">
            Envie uma foto para cada situacao. Os arquivos ficam na pasta de
            uploads do projeto. Prefira JPG/PNG com ate 10 MB. HEIC pode nao
            aparecer em alguns navegadores.
          </p>
          {saved ? <p className="helper">Fotos atualizadas com sucesso.</p> : null}

          <PhotoUploadForm photos={photos} />
        </div>
      </div>
    </div>
  );
}
