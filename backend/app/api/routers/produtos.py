import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from sqlalchemy import func

from app.database import get_db
from app.models.produto import Produto
from app.models.item_pedido import ItemPedido
from app.models.avaliacao_pedido import AvaliacaoPedido
from app.schemas.produto import ProdutoCreate, ProdutoResponse, ProdutoUpdate, ProdutoDetalhesResponse

router = APIRouter(
    prefix="/produtos",
    tags=["Produtos"]
)

# 1. Listagem com PAGINAÇÃO, PREÇO REAL e AVALIAÇÕES (Usando Subconsultas)
@router.get("/", response_model=List[ProdutoResponse])
def listar_produtos(
    limit: int = 50, 
    skip: int = 0, 
    busca: Optional[str] = None, 
    db: Session = Depends(get_db)
):
    preco_medio_query = (
        db.query(
            ItemPedido.id_produto,
            func.avg(ItemPedido.preco_BRL).label("preco_brl")
        )
        .group_by(ItemPedido.id_produto)
        .subquery()
    )

    media_avaliacoes_query = (
        db.query(
            ItemPedido.id_produto,
            func.avg(AvaliacaoPedido.avaliacao).label("media_avaliacoes")
        )
        .join(ItemPedido, AvaliacaoPedido.id_pedido == ItemPedido.id_pedido)
        .group_by(ItemPedido.id_produto)
        .subquery()
    )

    consulta = (
        db.query(
            Produto.id_produto,
            Produto.nome_produto,
            Produto.categoria_produto,
            Produto.imagem_url,
            Produto.peso_produto_gramas,
            Produto.comprimento_centimetros,
            Produto.altura_centimetros,
            Produto.largura_centimetros,
            preco_medio_query.c.preco_brl,
            media_avaliacoes_query.c.media_avaliacoes
        )
        .outerjoin(preco_medio_query, Produto.id_produto == preco_medio_query.c.id_produto)
        .outerjoin(media_avaliacoes_query, Produto.id_produto == media_avaliacoes_query.c.id_produto)
    )
    
    if busca:
        consulta = consulta.filter(Produto.nome_produto.ilike(f"%{busca}%"))
        
    # Executa a busca aplicando o limite da paginação
    produtos = consulta.offset(skip).limit(limit).all()
    
    return produtos

# 2. Busca Detalhes Avançados 
@router.get("/{id_produto}/detalhes", response_model=ProdutoDetalhesResponse)
def obter_produto_detalhes(id_produto: str, db: Session = Depends(get_db)):
    produto = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    
    preco_medio = db.query(func.avg(ItemPedido.preco_BRL)).filter(ItemPedido.id_produto == id_produto).scalar()
    
    total_vendas = db.query(ItemPedido).filter(ItemPedido.id_produto == id_produto).count()
    
    avaliacoes_consulta = (
        db.query(AvaliacaoPedido)
        .join(ItemPedido, AvaliacaoPedido.id_pedido == ItemPedido.id_pedido)
        .filter(ItemPedido.id_produto == id_produto)
        .all()
    )
    
    lista_avaliacoes = []
    soma_notas = 0
    for av in avaliacoes_consulta:
        soma_notas += av.avaliacao
        lista_avaliacoes.append({
            "nota": av.avaliacao,
            "titulo": av.titulo_comentario or "Sem título",
            "comentario": av.comentario or "Sem comentário",
            "data": av.data_comentario
        })
        
    media = soma_notas / len(avaliacoes_consulta) if avaliacoes_consulta else 0.0
    
    return {
        **produto.__dict__,
        "preco_brl": preco_medio or 0.0,
        "total_vendas": total_vendas,
        "media_avaliacoes": round(media, 1),
        "avaliacoes": lista_avaliacoes
    }

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=ProdutoResponse)
def criar_produto(produto: ProdutoCreate, db: Session = Depends(get_db)):
    novo_id = uuid.uuid4().hex 
    novo_produto = Produto(id_produto=novo_id, **produto.model_dump())
    db.add(novo_produto)
    db.commit()
    db.refresh(novo_produto)
    return novo_produto

@router.put("/{id_produto}", response_model=ProdutoResponse)
def substituir_produto(id_produto: str, produto_atualizado: ProdutoCreate, db: Session = Depends(get_db)):
    produto = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    for chave, valor in produto_atualizado.model_dump().items():
        setattr(produto, chave, valor)
    db.commit()
    db.refresh(produto)
    return produto

@router.delete("/{id_produto}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_produto(id_produto: str, db: Session = Depends(get_db)):
    produto = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    db.delete(produto)
    db.commit()
    return None