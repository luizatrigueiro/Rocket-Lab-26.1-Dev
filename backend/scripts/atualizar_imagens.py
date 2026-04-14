import pandas as pd
from sqlalchemy import create_engine, text

SQLALCHEMY_DATABASE_URL = "sqlite:///./database.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)

print("Iniciando o mapeamento de imagens...\n")

try:
    df_imagens = pd.read_csv("./dados/dim_categoria_imagens.csv") 
    
    with engine.begin() as conn:
        print("Atualizando os produtos...")
        for index, row in df_imagens.iterrows():
            # AQUI ESTÁ A MÁGICA: Usando os nomes EXATOS do seu CSV
            categoria = row.get('Categoria')
            url = row.get('Link')
            
            if pd.notna(categoria) and pd.notna(url):
                query = text("""
                    UPDATE produtos 
                    SET imagem_url = :url 
                    WHERE categoria_produto = :categoria
                """)
                conn.execute(query, {"url": url, "categoria": categoria})
                
    print("\n✅ Sucesso! Todas as imagens foram vinculadas aos produtos!")
except Exception as e:
    print(f"❌ Erro: {e}")