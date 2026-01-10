import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { TAG_LABELS } from "@/lib/constants";
import { createProductAction } from "@/app/admin/actions";

export default async function NovoProdutoPage() {
  await requireAdmin();

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <Link href="/admin" className="brand">
            <div className="brand-mark">LJ</div>
            <div>
              <div className="brand-title">Painel admin</div>
              <div className="brand-subtitle">Novo presente</div>
            </div>
          </Link>
          <Link className="btn btn-secondary" href="/admin">
            Voltar
          </Link>
        </header>

        <div className="admin-shell">
          <form action={createProductAction} className="form-grid">
            <div>
              <label htmlFor="nome">Nome</label>
              <input id="nome" name="nome" type="text" required />
            </div>

            <div>
              <label htmlFor="slug">Slug</label>
              <input
                id="slug"
                name="slug"
                type="text"
                placeholder="Gerado automaticamente se vazio"
              />
            </div>

            <div>
              <label htmlFor="descricao">Descrição emocional</label>
              <textarea id="descricao" name="descricao" required />
            </div>

            <div>
              <label htmlFor="preco">Preço</label>
              <input id="preco" name="preco" type="number" step="0.01" required />
            </div>

            <div>
              <label htmlFor="tagCrianca">Tag da criança</label>
              <select id="tagCrianca" name="tagCrianca" required>
                {Object.entries(TAG_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="imagens">Imagens (uma URL por linha)</label>
              <textarea id="imagens" name="imagens" />
              <p className="helper">
                Use URLs completas ou caminhos locais dentro de /public.
              </p>
            </div>

            <div>
              <label htmlFor="paymentLink">Link do Mercado Pago</label>
              <input id="paymentLink" name="paymentLink" type="url" required />
              <p className="helper">
                Configure o link para retornar a /confirmacao?paid=true.
              </p>
            </div>

            <div>
              <label htmlFor="ativo">Ativo na loja</label>
              <input id="ativo" name="ativo" type="checkbox" defaultChecked />
            </div>

            <div className="form-actions">
              <button className="btn" type="submit">
                Salvar presente
              </button>
              <Link className="btn btn-secondary" href="/admin">
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
