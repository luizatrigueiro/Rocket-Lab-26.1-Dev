import pandas as pd
from sqlalchemy import create_engine

# Conecta no seu banco de dados
SQLALCHEMY_DATABASE_URL = "sqlite:///./database.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)

print("Iniciando diagnóstico de categorias...\n")

try:
    # 1. Lê o CSV das imagens
    print("Lendo dim_categoria_imagens.csv...")
    # Ajuste o nome se for diferente na sua pasta dados
    df_imagens = pd.read_csv("./dados/dim_categoria_imagens.csv") 
    
    # Assumindo que a coluna no CSV se chama 'categoria_produto'
    # Se for 'dim_categoria_imagens.csv', nós ajustamos!
    col_categoria_csv = 'categoria_produto'
    categorias_csv = set(df_imagens[col_categoria_csv].unique())
    print(f"Total de categorias únicas no CSV: {len(categorias_csv)}")

    # 2. Busca categorias do banco
    with engine.connect() as conn:
        print("Buscando categorias do banco de dados...")
        df_produtos = pd.read_sql("SELECT DISTINCT categoria_produto FROM produtos", con=conn)
        categorias_db = set(df_produtos['categoria_produto'].unique())
        print(f"Total de categorias únicas no banco: {len(categorias_db)}")
        
        # Encontra categorias no banco que NÃO estão no CSV
        categorias_nao_encontradas = categorias_db - categorias_csv
        
        if categorias_nao_encontradas:
            print("\n❌ ERRO DE CORRESPONDÊNCIA ENCONTRADO!")
            print(f"As seguintes categorias existem no banco, mas não têm imagens no CSV ({len(categorias_nao_encontradas)} total):")
            # Mostra apenas as primeiras 10 para não sobrecarregar
            for cat in list(categorias_nao_encontradas)[:10]:
                print(f"- '{cat}'")
        else:
            print("\n✅ Sucesso! Todas as categorias do banco têm correspondência no CSV.")

except Exception as e:
    print(f"❌ Erro inesperado: {e}")