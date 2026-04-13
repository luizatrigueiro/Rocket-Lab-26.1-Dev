export type Produto = {
  id_produto: string;
  nome_produto: string;
  categoria_produto: string;
  peso_produto_gramas: number;
  comprimento_centimetros: number;
  altura_centimetros: number;
  largura_centimetros: number;
};

export type ProductFormData = Omit<Produto, 'id_produto'>;