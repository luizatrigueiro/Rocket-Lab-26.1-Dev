import { Link } from "react-router-dom";
import { Star, Package, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Produto } from "@/types/produto";

interface CartaoProdutoProps {
  produto: Produto;
}

const CartaoProduto = ({ produto }: CartaoProdutoProps) => {
  const precoFormatado = produto.preco_brl && produto.preco_brl > 0
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.preco_brl)
    : "Consulte o preço";

  return (
    <Card className="group overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full animate-in fade-in zoom-in duration-500 relative">
      
      <Link to={`/produtos/${produto.id_produto}`} className="flex flex-col flex-grow text-inherit no-underline">
        
        {/* Imagem */}
        <div className="aspect-square bg-white relative overflow-hidden flex items-center justify-center border-b border-slate-100">
          {produto.imagem_url ? (
            <img
              src={produto.imagem_url}
              alt={produto.nome_produto}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                // Fallback para caso o link da imagem quebre
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`flex items-center justify-center w-full h-full bg-slate-50 text-slate-300 ${produto.imagem_url ? 'hidden' : ''}`}>
            <Package size={64} strokeWidth={1.5} />
          </div>
        </div>

        <CardContent className="p-5 flex-grow flex flex-col">
          {/* Categoria */}
          <Badge className="w-fit bg-slate-100 text-slate-600 hover:bg-slate-200 border-none mb-3 text-[10px] uppercase tracking-wider font-semibold">
            {produto.categoria_produto.replace('_', ' ')}
          </Badge>

          {/* Título */}
          <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2 line-clamp-2" title={produto.nome_produto}>
            {produto.nome_produto}
          </h3>

          {/* Avaliações */}
          <div className="flex items-center gap-1.5 mt-auto mb-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < Math.round(produto.media_avaliacoes || 0) ? "currentColor" : "none"}
                  className={i < Math.round(produto.media_avaliacoes || 0) ? "" : "text-slate-300"}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {produto.media_avaliacoes ? produto.media_avaliacoes.toFixed(1) : "0.0"}
            </span>
          </div>

          {/* Preço (Média de Vendas) */}
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-md">
            <TrendingUp size={16} className={produto.preco_brl && produto.preco_brl > 0 ? "text-emerald-500" : "text-slate-400"} />
            <span className={`font-black ${produto.preco_brl && produto.preco_brl > 0 ? 'text-xl text-slate-900' : 'text-sm text-slate-500'}`}>
              {precoFormatado}
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default CartaoProduto;