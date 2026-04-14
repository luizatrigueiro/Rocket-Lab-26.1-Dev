import { useProdutos } from "@/contexts/ContextoProduto";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Package, Edit, Eye } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

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
} from "@/components/ui/alert-dialog";

const GerenciarProdutos = () => {
  const { produtos, deletarProduto, carregando } = useProdutos();
  const navigate = useNavigate();

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500 animate-pulse">Carregando dados do banco...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 animate-in fade-in duration-500 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Gerenciar Produtos</h1>
          <p className="text-slate-500 mt-1">Controle total do seu catálogo de e-commerce.</p>
        </div>
      </div>

      <Card className="shadow-md border-slate-200">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-slate-700">Lista de Produtos ({produtos.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {produtos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Package size={48} className="mb-4 opacity-20" />
              <p className="text-lg">Nenhum produto cadastrado no banco de dados.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[40%] pl-6">Nome do Produto</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right pr-6">Ações Rápidas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtos.map((p) => (
                    <TableRow key={p.id_produto} className="hover:bg-slate-50/80 transition-colors group">
                      <TableCell className="font-medium pl-6">
                        <Link 
                          to={`/produtos/${p.id_produto}`} 
                          className="text-slate-800 hover:text-indigo-600 hover:underline transition-colors font-semibold"
                        >
                          {p.nome_produto}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {p.categoria_produto}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          
                          {/* Botão Atalho: Ver Detalhes */}
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50"
                            onClick={() => navigate(`/produtos/${p.id_produto}`)}
                            title="Ver Detalhes"
                          >
                            <Eye size={14} />
                          </Button>

                          {/* Botão Atalho: Editar */}
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 text-slate-500 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50"
                            onClick={() => navigate(`/produtos/novo?id=${p.id_produto}`)}
                            title="Editar Produto"
                          >
                            <Edit size={14} />
                          </Button>

                          {/* Modal de Confirmação para Excluir */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                                title="Excluir Produto"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white border-2 border-indigo-500 shadow-lg shadow-indigo-100 rounded-xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-slate-900">Você tem certeza absoluta?</AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-600">
                                  Esta ação apagará o produto <strong>{p.nome_produto}</strong> do banco de dados permanentemente. Isso não pode ser desfeito.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="hover:bg-slate-100">Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => deletarProduto(p.id_produto)}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  Sim, excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                        </div>
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