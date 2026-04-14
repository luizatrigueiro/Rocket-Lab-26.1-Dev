import pandas as pd
from sqlalchemy import create_engine, text

SQLALCHEMY_DATABASE_URL = "sqlite:///./database.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)

print("Resolvendo duplicatas e finalizando a importação...\n")

try:
    print("Lendo o arquivo CSV de produtos...")
    df_produtos = pd.read_csv("./dados/dim_produtos.csv")
    
    df_produtos['categoria_produto'] = df_produtos['categoria_produto'].fillna('Outros')
    df_produtos['nome_produto'] = df_produtos['nome_produto'].fillna('Produto sem nome')
    
    if 'imagem_url' not in df_produtos.columns:
        df_produtos['imagem_url'] = None
        
    df_existentes = pd.read_sql("SELECT id_produto FROM produtos", con=engine)
    ids_existentes = df_existentes['id_produto'].tolist()
    
    df_novos_produtos = df_produtos[~df_produtos['id_produto'].isin(ids_existentes)]
    
    print(f"Total no CSV: {len(df_produtos)}. Já salvos: {len(ids_existentes)}. Inserindo os {len(df_novos_produtos)} restantes...")
    
    if len(df_novos_produtos) > 0:
        df_novos_produtos.to_sql('produtos', con=engine, if_exists='append', index=False)
        print("✅ Produtos que faltavam foram importados com sucesso! Banco 100% pronto.")
    else:
        print("✅ Todos os produtos já estavam no banco. Banco 100% pronto.")
        
except Exception as e:
    print(f"❌ Erro ao importar Produtos: {e}")