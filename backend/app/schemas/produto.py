from pydantic import BaseModel
from typing import Optional

# Schema usado para validar os dados
class ProdutoBase(BaseModel):
    nome_produto: str
    categoria_produto: str
    peso_produto_gramas: Optional[float] = None
    comprimento_centimetros: Optional[float] = None
    altura_centimetros: Optional[float] = None
    largura_centimetros: Optional[float] = None

# Schema usado quando o usuário vai criar um produto (POST)
class ProdutoCreate(ProdutoBase):
    pass

# Schema usado para atualizar o produto (PATCH - todos os campos opcionais)
class ProdutoUpdate(BaseModel):
    nome_produto: Optional[str] = None
    categoria_produto: Optional[str] = None
    peso_produto_gramas: Optional[float] = None
    comprimento_centimetros: Optional[float] = None
    altura_centimetros: Optional[float] = None
    largura_centimetros: Optional[float] = None

# Schema usado quando a API devolve o produto pro Frontend (GET)
class ProdutoResponse(ProdutoBase):
    id_produto: str

    class Config:
        from_attributes = True

# Schema detalhado para a página do produto
class ProdutoDetalhesResponse(ProdutoResponse):
    total_vendas: int
    media_avaliacoes: float
    avaliacoes: list[dict] 

    class Config:
        from_attributes = True