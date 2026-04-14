/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
import type { Produto, ProdutoDetalhes } from "@/types/produto"; 
import { api } from "@/services/api";
import { useToast } from "@/hooks/useToast";

// Interface para o formulário base 
interface ProdutoFormulario {
  nome_produto: string;
  categoria_produto: string;
  peso_produto_gramas: number;
  comprimento_centimetros: number;
  altura_centimetros: number;
  largura_centimetros: number;
  imagem_url?: string
}

interface ContextoProdutoType {
  produtos: Produto[];
  carregando: boolean;
  adicionarProduto: (dados: ProdutoFormulario) => Promise<void>;
  deletarProduto: (id: string) => Promise<void>;
  atualizarProduto: (id: string, dados: ProdutoFormulario) => Promise<void>;
  buscarProdutoPorId: (id: string) => Produto | undefined;
  obterDetalhesProduto: (id: string) => Promise<ProdutoDetalhes | null>; 
  carregarMaisProdutos: (pagina: number) => Promise<void>;
}

export const ContextoProduto = createContext<ContextoProdutoType | undefined>(undefined);

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
        description: "Não foi possível carregar os produtos do banco.",
        variant: "destructive" 
      });
    } finally {
      setCarregando(false);
    }
  }, [toast]);

  useEffect(() => {
    listarProdutos();
  }, [listarProdutos]);

  const carregarMaisProdutos = async (pagina: number) => {
    const skip = (pagina - 1) * 50;
    try {
      const resposta = await api.get(`/produtos/?limit=50&skip=${skip}`);
      setProdutos((prev) => [...prev, ...resposta.data]);
    } catch {
      toast({ title: "Erro", description: "Não foi possível carregar mais produtos.", variant: "destructive" });
    }
  };

  const adicionarProduto = async (dados: ProdutoFormulario) => {
    try {
      await api.post("/produtos/", dados);
      await listarProdutos();
      toast({ title: "Sucesso", description: "Produto cadastrado com sucesso!" });
    } catch {
      toast({ title: "Erro", description: "Falha ao salvar produto.", variant: "destructive" });
    }
  };

  const atualizarProduto = async (id: string, dados: ProdutoFormulario) => {
    try {
      await api.put(`/produtos/${id}`, dados);
      await listarProdutos();
      toast({ title: "Sucesso", description: "Produto atualizado com sucesso!" });
    } catch {
      toast({ title: "Erro", description: "Falha ao atualizar produto.", variant: "destructive" });
    }
  };

  const deletarProduto = async (id: string) => {
    try {
      await api.delete(`/produtos/${id}`);
      setProdutos((prev) => prev.filter((p) => p.id_produto !== id));
      toast({ title: "Removido", description: "Produto excluído do sistema." });
    } catch {
      toast({ title: "Erro", description: "Falha ao remover produto.", variant: "destructive" });
    }
  };

  const buscarProdutoPorId = (id: string) => produtos.find((p) => p.id_produto === id);

  const obterDetalhesProduto = async (id: string) => {
    try {
      const resposta = await api.get(`/produtos/${id}/detalhes`);
      return resposta.data; 
    } catch {
      toast({ title: "Erro", description: "Não foi possível carregar os detalhes e avaliações do produto.", variant: "destructive" });
      return null;
    }
  };

  return (
    <ContextoProduto.Provider value={{ 
      produtos, 
      carregando, 
      adicionarProduto, 
      deletarProduto, 
      atualizarProduto, 
      buscarProdutoPorId,
      obterDetalhesProduto,
      carregarMaisProdutos
    }}>
      {children}
    </ContextoProduto.Provider>
  );
};

export const useProdutos = () => {
  const contexto = useContext(ContextoProduto);
  if (!contexto) throw new Error("useProdutos deve ser usado dentro de ProvedorProduto");
  return contexto;
};