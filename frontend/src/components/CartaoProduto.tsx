import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Package } from "lucide-react";
import type { Produto } from "@/types/produto";

interface CartaoProdutoProps {
  produto: Produto;
}

export const CartaoProduto = ({ produto }: CartaoProdutoProps) => {
  return (
    <Card className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white">
      {/* Área da Imagem (Placeholder) */}
      <div className="aspect-square bg-slate-100 relative flex items-center justify-center overflow-hidden">
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none">Ativo</Badge>
        </div>
        
        {/* Ícone de placeholder que aumenta no hover */}
        <Package className="w-16 h-16 text-slate-300 group-hover:scale-110 transition-transform duration-500" />
        
        {/* Badge de Destaque (Fictício para o visual) */}
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
            ⭐ Destaque
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {produto.categoria_produto}
        </p>
        <h3 className="font-semibold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">
          {produto.nome_produto}
        </h3>
        
        <div className="flex flex-col gap-1 pt-2">
          {/* Preço Fictício para compor o visual da foto */}
          <span className="text-lg font-bold text-slate-900">R$ 279,90</span>
          
          {/* Estrelinhas de Avaliação */}
          <div className="flex items-center gap-1">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill={i < 4 ? "currentColor" : "none"} className={i < 4 ? "" : "text-slate-300"} />
              ))}
            </div>
            <span className="text-[10px] text-slate-400">(12 vendas)</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="w-full h-[1px] bg-slate-100" />
      </CardFooter>
    </Card>
  );
};