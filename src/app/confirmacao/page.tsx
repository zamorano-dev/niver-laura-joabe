import Link from "next/link";
import { TAG_LABELS } from "@/lib/constants";

type ConfirmacaoPageProps = {
  searchParams?: Promise<{ paid?: string }>;
};

export default async function ConfirmacaoPage({
  searchParams,
}: ConfirmacaoPageProps) {
  const resolvedSearchParams = await searchParams;
  const paid = resolvedSearchParams?.paid === "true";

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <Link href="/" className="brand">
            <div className="brand-mark">LJ</div>
            <div>
              <div className="brand-title">Loja do Aniversário</div>
              <div className="brand-subtitle">Laura Ludovica & Joabe Lincoln</div>
            </div>
          </Link>
          <Link className="btn btn-secondary" href="/">
            Voltar para a loja
          </Link>
        </header>

        <div className="confirmation">
          {paid ? (
            <>
              <span className="badge" data-tag="COMPARTILHADO">
                {TAG_LABELS.COMPARTILHADO}
              </span>
              <h1>Presente confirmado</h1>
              <p>
                🎉 Obrigado por presentear Laura Ludovica (4 anos) e/ou Joabe
                Lincoln (1 ano). Seu carinho faz parte desse momento especial da
                nossa família.
              </p>
            </>
          ) : (
            <>
              <h1>Confirmação não encontrada</h1>
              <p>
                Ainda não identificamos a confirmação do presente. Se você
                acabou de finalizar, aguarde alguns minutos e tente novamente.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
