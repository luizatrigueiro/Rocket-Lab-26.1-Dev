import { useState } from "react";
import { useProdutos } from "@/contexts/ContextoProduto";
import CartaoProduto from "@/components/organisms/CartaoProduto";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { Search, LayoutGrid, PackageSearch, Star, ChevronDown } from "lucide-react";

const Inicio = () => {
  const { produtos, carregando, carregarMaisProdutos } = useProdutos();
  
  const [filtro, setFiltro] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");
  const [minEstrelas, setMinEstrelas] = useState<number>(0);
  const [pagina, setPagina] = useState(1);

  const categoriasUnicas = ["Todos", ...new Set(produtos.map(p => p.categoria_produto))];

  const produtosFiltrados = produtos.filter(p => {
    const buscaOk = p.nome_produto.toLowerCase().includes(filtro.toLowerCase());
    const categoriaOk = categoriaSelecionada === "Todos" || p.categoria_produto === categoriaSelecionada;
    const estrelasOk = (p.media_avaliacoes || 0) >= minEstrelas;
    return buscaOk && categoriaOk && estrelasOk;
  });

  const handleCarregarMais = async () => {
    const proximaPagina = pagina + 1;
    setPagina(proximaPagina);
    await carregarMaisProdutos(proximaPagina);
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-700">
        
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Vitrine de Produtos</h1>
          <p className="text-slate-500 mt-1">Gerencie e acompanhe o desempenho dos seus produtos em tempo real.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input 
              placeholder="Buscar produtos pelo nome..." 
              className="pl-10 h-12 bg-white border-slate-200 focus:ring-2"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
        </div>

        {/* Filtros de Categoria */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categoriasUnicas.map(cat => (
            <Button
              key={cat}
              variant={categoriaSelecionada === cat ? "default" : "outline"}
              className={`rounded-full px-6 transition-all ${
                categoriaSelecionada === cat 
                ? "bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200" 
                : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
              onClick={() => setCategoriaSelecionada(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Filtro de Estrelas */}
        <div className="flex items-center gap-2 mb-12 bg-white p-2 rounded-xl w-fit border border-slate-200 shadow-sm">
          <span className="text-sm font-semibold text-slate-500 px-3">Avaliação Mínima:</span>
          {[0, 3, 4, 4.5].map(nota => (
            <Button
              key={nota}
              variant={minEstrelas === nota ? "default" : "ghost"}
              size="sm"
              className={`rounded-lg gap-1 ${minEstrelas === nota ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : "text-slate-500"}`}
              onClick={() => setMinEstrelas(nota)}
            >
              {nota === 0 ? "Todas" : <>{nota}+ <Star size={14} fill="currentColor" /></>}
            </Button>
          ))}
        </div>

        {/* Listagem */}
        {carregando && produtos.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : produtosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 border-2 border-dashed rounded-3xl">
            <PackageSearch size={64} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">Nenhum produto encontrado com esses filtros.</p>
          </div>
        ) : (
          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-2 mb-6">
                <LayoutGrid className="text-indigo-600" size={20} />
                <h2 className="text-xl font-bold text-slate-800">Resultados da Busca</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {produtosFiltrados.map(p => (
                  <CartaoProduto key={p.id_produto} produto={p} />
                ))}
              </div>
            </section>

            <div className="flex justify-center pt-8 border-t border-slate-200">
              <Button 
                variant="outline" 
                size="lg" 
                className="gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                onClick={handleCarregarMais}
              >
                Carregar Mais Produtos <ChevronDown size={18} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inicio;