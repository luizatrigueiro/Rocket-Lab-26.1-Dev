import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProdutos } from "@/contexts/ContextoProduto";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { ArrowLeft, Edit, Trash2, Package, Ruler, Star, MessageSquare, TrendingUp } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/atoms/alert-dialog";

import type { ProdutoDetalhes } from "@/types/produto";

const DetalhesProduto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { obterDetalhesProduto, deletarProduto } = useProdutos();
  
  const [detalhes, setDetalhes] = useState<ProdutoDetalhes | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarDados = async () => {
      if (id) {
        setCarregando(true);
        const dados = await obterDetalhesProduto(id);
        setDetalhes(dados);
        setCarregando(false);
      }
    };
    buscarDados();
  }, [id, obterDetalhesProduto]);

  if (carregando) {
    return <div className="py-20 text-center animate-pulse text-slate-500">Buscando informações e avaliações...</div>;
  }

  if (!detalhes) {
    return (
      <div className="container mx-auto py-20 text-center">
        <p className="text-xl text-slate-500">Produto não encontrado.</p>
        <Button onClick={() => navigate("/")} className="mt-4">Voltar ao Início</Button>
      </div>
    );
  }

  const handleConfirmarExclusao = async () => {
    await deletarProduto(detalhes.id_produto);
    navigate("/produtos/gerenciar");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl animate-in fade-in duration-500">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2">
        <ArrowLeft size={16} /> Voltar
      </Button>

      {/* Cabeçalho do Produto */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        
        <div className="aspect-square bg-white rounded-2xl flex items-center justify-center border shadow-sm overflow-hidden relative">
          {detalhes.imagem_url ? (
            <img 
              src={detalhes.imagem_url} 
              alt={detalhes.nome_produto} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`flex items-center justify-center w-full h-full bg-slate-50 ${detalhes.imagem_url ? 'hidden' : ''}`}>
             <Package size={80} className="text-slate-300" />
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col justify-center">
          <Badge className="w-fit bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none mb-3">
            {detalhes.categoria_produto}
          </Badge>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{detalhes.nome_produto}</h1>
          
          <div className="flex items-center gap-3 text-amber-400 mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill={i < Math.round(detalhes.media_avaliacoes) ? "currentColor" : "none"} className={i < Math.round(detalhes.media_avaliacoes) ? "" : "text-slate-300"} />
              ))}
            </div>
            <span className="text-slate-700 font-bold">{detalhes.media_avaliacoes.toFixed(1)}</span>
            <span className="text-slate-400 text-sm">({detalhes.avaliacoes?.length || 0} avaliações)</span>
          </div>

          <div className="mb-6">
            {detalhes.preco_brl && detalhes.preco_brl > 0 ? (
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-emerald-600">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(detalhes.preco_brl)}
                </span>
                <span className="text-sm text-slate-500 mb-1">preço médio histórico</span>
              </div>
            ) : (
              <span className="text-xl font-bold text-slate-500">Preço sob consulta</span>
            )}
          </div>

          <div className="flex gap-4">
            <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700" onClick={() => navigate(`/produtos/novo?id=${detalhes.id_produto}`)}>
              <Edit size={16} /> Editar
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 gap-2">
                  <Trash2 size={16} /> Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white border-2 border-indigo-500 shadow-lg shadow-indigo-100 rounded-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-slate-900">Você tem certeza absoluta?</AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-600">
                    Esta ação apagará o produto <strong>{detalhes.nome_produto}</strong> do banco de dados permanentemente. Isso não pode ser desfeito.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="hover:bg-slate-100">Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleConfirmarExclusao}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Sim, excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

          </div>
        </div>
      </div>

      {/* Cards de Métricas (Logística e Vendas) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
              <Ruler size={16} /> Dimensões e Peso
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-slate-50 p-3 rounded-lg"><p className="text-xs text-slate-400">Larg.</p><p className="font-bold text-slate-700">{detalhes.largura_centimetros}cm</p></div>
            <div className="bg-slate-50 p-3 rounded-lg"><p className="text-xs text-slate-400">Alt.</p><p className="font-bold text-slate-700">{detalhes.altura_centimetros}cm</p></div>
            <div className="bg-slate-50 p-3 rounded-lg"><p className="text-xs text-slate-400">Comp.</p><p className="font-bold text-slate-700">{detalhes.comprimento_centimetros}cm</p></div>
            <div className="bg-slate-50 p-3 rounded-lg"><p className="text-xs text-slate-400">Peso</p><p className="font-bold text-slate-700">{detalhes.peso_produto_gramas}g</p></div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
              <Package size={16} /> Desempenho
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between">
               <div>
                 <p className="text-xs text-slate-400 mb-1">Vendas Totais</p>
                 <p className="text-2xl font-black text-indigo-600">{detalhes.total_vendas} un.</p>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
              <TrendingUp size={16} /> Logística
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-center">
              <span className="text-xs text-slate-500">Estado do Vendedor:</span>
              <Badge variant="outline" className="bg-white">{detalhes.estado_principal_vendedor || "N/A"}</Badge>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-center">
              <span className="text-xs text-slate-500">Entrega Média:</span>
              <span className="font-bold text-slate-700">{detalhes.tempo_medio_entrega ? detalhes.tempo_medio_entrega.toFixed(0) + " dias" : "N/A"}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-center">
              <span className="text-xs text-slate-500">Custo de Frete:</span>
              <span className="font-bold text-emerald-600">
                {detalhes.frete_medio && detalhes.frete_medio > 0 
                  ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(detalhes.frete_medio)
                  : "Grátis / Não medido"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Avaliações */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-slate-800"><MessageSquare size={20} className="text-indigo-600"/> Avaliações de Clientes</span>
            <span className="text-sm font-normal text-slate-500">Média: {detalhes.media_avaliacoes.toFixed(1)} / 5.0</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {(!detalhes.avaliacoes || detalhes.avaliacoes.length === 0) ? (
             <div className="p-10 text-center text-slate-400">Nenhuma avaliação encontrada para este produto ainda.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {detalhes.avaliacoes.map((av, index) => (
                <div key={index} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-slate-800">{av.titulo || "Sem Título"}</h4>
                      <p className="text-xs text-slate-400 mt-1">{new Date(av.data).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < av.nota ? "currentColor" : "none"} className={i < av.nota ? "" : "text-slate-300"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{av.comentario}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DetalhesProduto;