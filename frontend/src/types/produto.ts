export interface Produto {
  id_produto: string;
  nome_produto: string;
  categoria_produto: string;
  peso_produto_gramas: number;
  comprimento_centimetros: number;
  altura_centimetros: number;
  largura_centimetros: number;
  media_avaliacoes?: number; 
  imagem_url?: string; 
  preco_brl?: number;
}

export interface Avaliacao {
  nota: number;
  titulo: string;
  comentario: string;
  data: string;
}

export interface ProdutoDetalhes extends Produto {
  total_vendas: number;
  media_avaliacoes: number;
  frete_medio?: number;
  tempo_medio_entrega?: number; 
  estado_principal_vendedor?: string;
  avaliacoes: Avaliacao[];
}