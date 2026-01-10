import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/auth";
import { TAG_LABELS } from "@/lib/constants";
import { formatPriceBRL } from "@/lib/format";
import { getProducts } from "@/lib/products";
import { deleteProductAction, loginAction, logoutAction } from "./actions";

type AdminPageProps = {
  searchParams?: { error?: string };
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const isAuthenticated = await isAdminAuthenticated();
  const missingCredentials = !process.env.ADMIN_CPF || !process.env.ADMIN_PASSWORD;

  if (!isAuthenticated) {
    const errorMessage =
      searchParams?.error === "invalid"
        ? "CPF ou senha inválidos."
        : searchParams?.error === "missing"
          ? "Preencha CPF e senha."
          : null;

    return (
      <div className="page">
        <div className="container">
          <header className="header">
            <Link href="/" className="brand">
              <div className="brand-mark">LJ</div>
              <div>
                <div className="brand-title">Loja do Aniversário</div>
                <div className="brand-subtitle">
                  Laura Ludovica & Joabe Lincoln
                </div>
              </div>
            </Link>
          </header>

          <div className="admin-shell">
            <h1>Login do admin</h1>
            <p className="helper">
              Use o CPF e a senha configurados nas variáveis de ambiente.
            </p>
            {missingCredentials ? (
              <p className="helper">
                Configure ADMIN_CPF e ADMIN_PASSWORD no ambiente.
              </p>
            ) : null}
            {errorMessage ? <p className="helper">{errorMessage}</p> : null}

            <form action={loginAction} className="form-grid">
              <div>
                <label htmlFor="cpf">CPF</label>
                <input id="cpf" name="cpf" type="text" placeholder="00000000000" />
              </div>
              <div>
                <label htmlFor="senha">Senha</label>
                <input id="senha" name="senha" type="password" />
              </div>
              <div className="form-actions">
                <button className="btn" type="submit">
                  Entrar
                </button>
                <Link className="btn btn-secondary" href="/">
                  Voltar para a loja
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const products = await getProducts();

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
          <form action={logoutAction}>
            <button className="btn btn-secondary" type="submit">
              Sair
            </button>
          </form>
        </header>

        <div className="admin-shell">
          <div className="admin-header">
            <div>
              <h1>Painel admin</h1>
              <p className="helper">Gerencie os presentes exibidos na loja.</p>
            </div>
            <Link className="btn" href="/admin/produtos/novo">
              Novo presente
            </Link>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Presente</th>
                <th>Tag</th>
                <th>Preço</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.nome}</td>
                  <td>{TAG_LABELS[product.tagCrianca]}</td>
                  <td>{formatPriceBRL(product.preco)}</td>
                  <td>{product.ativo ? "Ativo" : "Oculto"}</td>
                  <td>
                    <div className="form-actions">
                      <Link
                        className="btn btn-secondary"
                        href={`/admin/produtos/${product.id}/editar`}
                      >
                        Editar
                      </Link>
                      <form action={deleteProductAction.bind(null, product.id)}>
                        <button className="btn" type="submit">
                          Remover
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
