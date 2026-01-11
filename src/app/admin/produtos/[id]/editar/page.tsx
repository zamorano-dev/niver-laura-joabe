import Link from "next/link";
import { notFound } from "next/navigation";
import { updateProductAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { TAG_LABELS } from "@/lib/constants";
import { getProductById } from "@/lib/products";

type EditarProdutoPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditarProdutoPage({
  params,
}: EditarProdutoPageProps) {
  await requireAdmin();
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const updateAction = updateProductAction.bind(null, product.id);

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <Link href="/admin" className="brand">
            <div className="brand-mark">LJ</div>
            <div>
              <div className="brand-title">Painel admin</div>
              <div className="brand-subtitle">Editar presente</div>
            </div>
          </Link>
          <Link className="btn btn-secondary" href="/admin">
            Voltar
          </Link>
        </header>

        <div className="admin-shell">
          <form action={updateAction} className="form-grid">
            <div>
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                name="nome"
                type="text"
                defaultValue={product.nome}
                required
              />
            </div>

            <div>
              <label htmlFor="slug">Slug</label>
              <input
                id="slug"
                name="slug"
                type="text"
                defaultValue={product.slug}
              />
            </div>

            <div>
              <label htmlFor="descricao">Descrição emocional</label>
              <textarea
                id="descricao"
                name="descricao"
                defaultValue={product.descricao}
                required
              />
            </div>

            <div>
              <label htmlFor="preco">Preço</label>
              <input
                id="preco"
                name="preco"
                type="number"
                step="0.01"
                defaultValue={product.preco}
                required
              />
            </div>

            <div>
              <label htmlFor="tagCrianca">Tag da criança</label>
              <select
                id="tagCrianca"
                name="tagCrianca"
                defaultValue={product.tagCrianca}
                required
              >
                {Object.entries(TAG_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="imagens">Imagens (uma URL por linha)</label>
              <textarea
                id="imagens"
                name="imagens"
                defaultValue={product.imagens.join("\n")}
              />
            </div>

            <div>
              <label htmlFor="paymentLink">Link externo do presente</label>
              <input
                id="paymentLink"
                name="paymentLink"
                type="url"
                defaultValue={product.paymentLink}
                required
              />
            </div>

            <div>
              <label htmlFor="ativo">Ativo na loja</label>
              <input
                id="ativo"
                name="ativo"
                type="checkbox"
                defaultChecked={product.ativo}
              />
            </div>

            <div>
              <label htmlFor="pago">Marcar como confirmado</label>
              <input
                id="pago"
                name="pago"
                type="checkbox"
                defaultChecked={product.pago}
              />
            </div>

            <div className="form-actions">
              <button className="btn" type="submit">
                Salvar alterações
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
