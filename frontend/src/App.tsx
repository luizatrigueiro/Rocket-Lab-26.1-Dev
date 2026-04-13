import { useProdutos } from '@/hooks/useProdutos';

// Aqui nós importamos os componentes chiques que você instalou do shadcn!
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function App() {
  const { produtos, loading, erro } = useProdutos();

  // Tela de Carregamento
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse text-lg font-medium">
          Carregando a vitrine... ⏳
        </p>
      </div>
    );
  }
  
  // Tela de Erro
  if (erro) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-destructive/10 text-destructive border border-destructive/20 px-6 py-4 rounded-lg font-medium">
          ❌ {erro}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabeçalho */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-2">
            🚀 Sistema E-Commerce
          </h1>
          <p className="text-muted-foreground text-lg">
            Gerenciamento do Catálogo de Produtos
          </p>
        </header>

        {/* Lista Vazia */}
        {produtos.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-background">
            <span className="text-4xl block mb-4">📦</span>
            <p className="text-muted-foreground font-medium">Nenhum produto cadastrado ainda.</p>
          </div>
        ) : (
          
          /* Vitrine em Grid */
          <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produtos.map((produto) => (
              
              /* Componente Card do shadcn */
              <Card key={produto.id_produto} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
                
                <CardHeader className="pb-4">
                  <CardDescription className="uppercase tracking-wider text-xs font-bold text-primary">
                    {produto.categoria_produto}
                  </CardDescription>
                  <CardTitle className="line-clamp-2 text-xl">
                    {produto.nome_produto}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-grow text-sm text-muted-foreground space-y-2">
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span>Peso:</span>
                    <span className="font-medium text-foreground">{produto.peso_produto_gramas}g</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span>Dimensões:</span>
                    <span className="font-medium text-foreground">
                      {produto.comprimento_centimetros}x{produto.largura_centimetros}x{produto.altura_centimetros}
                    </span>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-4 border-t border-border/50">
                  {/* Componente Button do shadcn */}
                  <Button className="w-full">
                    Ver Detalhes
                  </Button>
                </CardFooter>
                
              </Card>
            ))}
          </main>
        )}
      </div>
    </div>
  );
}

export default App;