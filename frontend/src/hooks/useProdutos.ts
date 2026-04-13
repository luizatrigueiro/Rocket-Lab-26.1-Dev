import { useState, useEffect } from "react";
import { api } from "@/services/api";

export type Produto = {
  id_produto: string;
  nome_produto: string;
  categoria_produto: string;
  peso_produto_gramas?: number;
  comprimento_centimetros?: number;
  altura_centimetros?: number;
  largura_centimetros?: number;
};

export const useProdutos = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const buscarProdutos = async () => {
      try {
        setLoading(true);
        // O Axios vai bater no seu backend que está rodando lá na porta 8000
        const response = await api.get("/produtos/"); 
        setProdutos(response.data);
      } catch (err) {
        setErro("Erro ao carregar os produtos. O backend está rodando?");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    buscarProdutos();
  }, []);

  return { produtos, loading, erro };
};