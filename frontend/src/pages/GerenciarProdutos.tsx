import { useProdutos } from "@/contexts/ContextoProduto";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GerenciarProdutos = () => {
  const { produtos, deletarProduto, carregando } = useProdutos();
  const navigate = useNavigate();

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground animate-pulse">Carregando dados do banco...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Produtos</h1>
          <p className="text-muted-foreground">Controle total do seu catálogo de e-commerce.</p>
        </div>
        <Button onClick={() => navigate("/produtos/novo")} className="gap-2">
          <Plus size={18} /> Novo Produto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catálogo Atual ({produtos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {produtos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Package size={40} className="mb-4 opacity-20" />
              <p>Nenhum produto cadastrado no banco de dados.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtos.map((p) => (
                    <TableRow key={p.id_produto} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{p.nome_produto}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                          {p.categoria_produto}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          onClick={() => deletarProduto(p.id_produto)}
                          title="Excluir Produto"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GerenciarProdutos;