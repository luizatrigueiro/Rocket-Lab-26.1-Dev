from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# 1. Schema das Avaliações Individuais
class AvaliacaoSchema(BaseModel):
    nota: int
    titulo: str
    comentario: str
    data: datetime

    class Config:
        from_attributes = True

# 2. Schema Base do Produto
class ProdutoBase(BaseModel):
    nome_produto: str
    categoria_produto: str
    peso_produto_gramas: float
    comprimento_centimetros: float
    altura_centimetros: float
    largura_centimetros: float

class ProdutoCreate(ProdutoBase):
    pass

class ProdutoUpdate(BaseModel):
    nome_produto: Optional[str] = None
    categoria_produto: Optional[str] = None
    peso_produto_gramas: Optional[float] = None
    comprimento_centimetros: Optional[float] = None
    altura_centimetros: Optional[float] = None
    largura_centimetros: Optional[float] = None
    imagem_url: Optional[str] = None

# 3. Schema da Vitrine (Cartões) 
class ProdutoResponse(ProdutoBase):
    id_produto: str
    imagem_url: Optional[str] = None
    preco_brl: Optional[float] = 0.0
    media_avaliacoes: Optional[float] = 0.0

    class Config:
        from_attributes = True

# 4. Schema da Tela de Detalhes 
class ProdutoDetalhesResponse(ProdutoResponse):
    total_vendas: int = 0
    avaliacoes: List[AvaliacaoSchema] = []

    class Config:
        from_attributes = True