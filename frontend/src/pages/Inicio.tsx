import { useState } from "react";
import { useProdutos } from "@/contexts/ContextoProduto";
import { CartaoProduto } from "@/components/CartaoProduto";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, LayoutGrid, PackageSearch } from "lucide-react";

const Inicio = () => {
  const { produtos, carregando } = useProdutos();
  const [filtro, setFiltro] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todos");

  // Pega categorias únicas do banco
  const categoriasUnicas = ["Todos", ...new Set(produtos.map(p => p.categoria_produto))];

  const produtosFiltrados = produtos.filter(p => {
    const buscaOk = p.nome_produto.toLowerCase().includes(filtro.toLowerCase());
    const categoriaOk = categoriaSelecionada === "Todos" || p.categoria_produto === categoriaSelecionada;
    return buscaOk && categoriaOk;
  });

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-700">
        
        {/* Título e Descrição */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Vitrine de Produtos</h1>
          <p className="text-slate-500 mt-1">Gerencie e acompanhe o desempenho dos seus produtos em tempo real.</p>
        </div>

        {/* Barra de Ferramentas: Busca */}
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

        {/* Filtros de Categoria (Pills) */}
        <div className="flex flex-wrap gap-2 mb-12">
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

        {/* Listagem em Grid */}
        {carregando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : produtosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 border-2 border-dashed rounded-3xl">
            <PackageSearch size={64} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">Nenhum produto encontrado na sua busca.</p>
          </div>
        ) : (
          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-2 mb-6">
                <LayoutGrid className="text-indigo-600" size={20} />
                <h2 className="text-xl font-bold text-slate-800">Todos os Produtos</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {produtosFiltrados.map(p => (
                  <CartaoProduto key={p.id_produto} produto={p} />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inicio;