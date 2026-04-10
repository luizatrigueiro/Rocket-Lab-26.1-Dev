import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy import func
from app.models.item_pedido import ItemPedido
from app.models.avaliacao_pedido import AvaliacaoPedido
from app.schemas.produto import ProdutoDetalhesResponse

from app.database import get_db
from app.models.produto import Produto
from app.schemas.produto import ProdutoCreate, ProdutoResponse, ProdutoUpdate

router = APIRouter(
    prefix="/produtos",
    tags=["Produtos"]
)

# Criação de um novo produto
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=ProdutoResponse)
def create_produto(produto: ProdutoCreate, db: Session = Depends(get_db)):
    novo_id = uuid.uuid4().hex 
    
    # Cria a instância do modelo do banco
    novo_produto = Produto(
        id_produto=novo_id,
        **produto.model_dump() 
    )
    
    # Salva no banco de dados
    db.add(novo_produto)
    db.commit()
    db.refresh(novo_produto)
    
    return novo_produto

# Listagem de todos os produtos (com busca opcional)
@router.get("/", response_model=List[ProdutoResponse])
def get_produtos(search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Produto)
    
    if search:
        query = query.filter(Produto.nome_produto.ilike(f"%{search}%"))
        
    return query.all()

# Busca um produto específico pelo ID
@router.get("/{id_produto}", response_model=ProdutoResponse)
def get_produto(id_produto: str, db: Session = Depends(get_db)):
    produto = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    
    if not produto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Produto não encontrado"
        )
        
    return produto

# Busca detalhes avançados de um produto (Vendas e Avaliações)
@router.get("/{id_produto}/detalhes", response_model=ProdutoDetalhesResponse)
def get_produto_detalhes(id_produto: str, db: Session = Depends(get_db)):
    # Busca os dados básicos do produto
    produto = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    if not produto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Produto não encontrado"
        )
    
    # Calcula o total de vendas 
    total_vendas = db.query(ItemPedido).filter(ItemPedido.id_produto == id_produto).count()
    
    # Busca todas as avaliações dos pedidos que contêm este produto
    avaliacoes_query = (
        db.query(AvaliacaoPedido)
        .join(ItemPedido, AvaliacaoPedido.id_pedido == ItemPedido.id_pedido)
        .filter(ItemPedido.id_produto == id_produto)
        .all()
    )
    
    # Calcula a média e formata as avaliações
    lista_avaliacoes = []
    soma_notas = 0
    
    for av in avaliacoes_query:
        soma_notas += av.avaliacao
        lista_avaliacoes.append({
            "nota": av.avaliacao,
            "titulo": av.titulo_comentario,
            "comentario": av.comentario,
            "data": av.data_comentario
        })
        
    media = soma_notas / len(avaliacoes_query) if avaliacoes_query else 0.0
    
    # Monta a resposta final
    response_data = {
        **produto.__dict__, 
        "total_vendas": total_vendas,
        "media_avaliacoes": round(media, 1), 
        "avaliacoes": lista_avaliacoes
    }
    
    return response_data

# Atualização de campos específicos
@router.patch("/{id_produto}", response_model=ProdutoResponse)
def update_produto(id_produto: str, produto_update: ProdutoUpdate, db: Session = Depends(get_db)):
    produto = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    if not produto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Produto não encontrado"
        )
    
    update_data = produto_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(produto, key, value)
        
    db.commit()
    db.refresh(produto)
    
    return produto

# Remove um produto
@router.delete("/{id_produto}", status_code=status.HTTP_204_NO_CONTENT)
def delete_produto(id_produto: str, db: Session = Depends(get_db)):
    produto = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    
    if not produto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Produto não encontrado"
        )
        
    db.delete(produto)
    db.commit()
    
    return None