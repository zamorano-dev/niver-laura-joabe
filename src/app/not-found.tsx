import Link from "next/link";

export default function NotFound() {
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
          <h1>Ops! Esta pagina ficou escondida</h1>
          <p>
            Parece que voce entrou em uma sala secreta da festa. Volte para a
            loja e escolha um presente cheio de carinho.
          </p>
          <div className="form-actions" style={{ justifyContent: "center" }}>
            <Link className="btn" href="/">
              Ir para a loja
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
