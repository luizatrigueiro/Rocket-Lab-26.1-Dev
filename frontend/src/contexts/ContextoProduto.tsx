/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
import type { Produto } from "@/types/produto";
import { api } from "@/services/api";
import { useToast } from "@/hooks/useToast";

interface ProdutoFormulario {
  nome_produto: string;
  categoria_produto: string;
  peso_produto_gramas: number;
  comprimento_centimetros: number;
  altura_centimetros: number;
  largura_centimetros: number;
}

interface ContextoProdutoTipo {
  produtos: Produto[];
  carregando: boolean;
  adicionarProduto: (dados: ProdutoFormulario) => Promise<void>;
  deletarProduto: (id: string) => Promise<void>;
  buscarProdutoPorId: (id: string) => Produto | undefined;
}

export const ContextoProduto = createContext<ContextoProdutoTipo | undefined>(undefined);

export const ProvedorProduto: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const { toast } = useToast();

  const listarProdutos = useCallback(async () => {
    try {
      setCarregando(true);
      const resposta = await api.get("/produtos/");
      setProdutos(resposta.data);
    } catch {
      toast({ 
        title: "Erro de Conexão", 
        description: "Não foi possível carregar os produtos.",
        variant: "destructive" 
      });
    } finally {
      setCarregando(false);
    }
  }, [toast]);

  useEffect(() => {
    listarProdutos();
  }, [listarProdutos]);

  const adicionarProduto = async (dados: ProdutoFormulario) => {
    try {
      await api.post("/produtos/", dados);
      await listarProdutos();
      toast({ title: "Sucesso", description: "Produto cadastrado!" });
    } catch {
      toast({ title: "Erro", description: "Falha ao salvar produto.", variant: "destructive" });
    }
  };

  const deletarProduto = async (id: string) => {
    try {
      await api.delete(`/produtos/${id}`);
      setProdutos((prev) => prev.filter((p) => p.id_produto !== id));
      toast({ title: "Removido", description: "Produto excluído." });
    } catch {
      toast({ title: "Erro", description: "Falha ao remover.", variant: "destructive" });
    }
  };

  const buscarProdutoPorId = (id: string) => produtos.find((p) => p.id_produto === id);

  return (
    <ContextoProduto.Provider value={{ produtos, carregando, adicionarProduto, deletarProduto, buscarProdutoPorId }}>
      {children}
    </ContextoProduto.Provider>
  );
};

export const useProdutos = () => {
  const contexto = useContext(ContextoProduto);
  if (!contexto) throw new Error("useProdutos deve ser usado dentro de ProvedorProduto");
  return contexto;
};