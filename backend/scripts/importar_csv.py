import pandas as pd
from sqlalchemy import create_engine

# Conecta no banco de dados
SQLALCHEMY_DATABASE_URL = "sqlite:///./database.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)

print("Iniciando a importação dos dados...\n")

# 1. Tabela Consumidores
try:
    print("Importando Consumidores...")
    df_consumidores = pd.read_csv("./dados/dim_consumidores.csv")
    df_consumidores.to_sql('consumidores', con=engine, if_exists='append', index=False)
    print("✅ Consumidores OK")
except Exception as e:
    print(f"❌ Erro em Consumidores: {e}")

# 2. Tabela Vendedores
try:
    print("Importando Vendedores...")
    df_vendedores = pd.read_csv("./dados/dim_vendedores.csv")
    df_vendedores.to_sql('vendedores', con=engine, if_exists='append', index=False)
    print("✅ Vendedores OK")
except Exception as e:
    print(f"❌ Erro em Vendedores: {e}")

# 3. Tabela Produtos
try:
    print("Importando Produtos...")
    df_produtos = pd.read_csv("./dados/dim_produtos.csv")
    
    if 'imagem_url' not in df_produtos.columns:
        df_produtos['imagem_url'] = None
        
    df_produtos.to_sql('produtos', con=engine, if_exists='append', index=False)
    print("✅ Produtos OK")
except Exception as e:
    print(f"❌ Erro em Produtos: {e}")

# 4. Tabela Pedidos 
try:
    print("Importando Pedidos...")
    df_pedidos = pd.read_csv("./dados/fat_pedidos.csv") 
    
    for col in ['pedido_compra_timestamp', 'pedido_entregue_timestamp', 'data_estimada_entrega']:
        if col in df_pedidos.columns:
            df_pedidos[col] = pd.to_datetime(df_pedidos[col], errors='coerce')
            
    df_pedidos.to_sql('pedidos', con=engine, if_exists='append', index=False)
    print("✅ Pedidos OK")
except FileNotFoundError:
    print("⚠️ Aviso: Arquivo fat_pedidos.csv não encontrado na pasta. Pulando...")
except Exception as e:
    print(f"❌ Erro em Pedidos: {e}")

# 5. Tabela Itens do Pedido
try:
    print("Importando Itens do Pedido...")
    df_itens = pd.read_csv("./dados/fat_itens_pedidos.csv")
    df_itens.to_sql('itens_pedidos', con=engine, if_exists='append', index=False)
    print("✅ Itens do Pedido OK")
except Exception as e:
    print(f"❌ Erro em Itens do Pedido: {e}")

# 6. Tabela Avaliações
try:
    print("Importando Avaliações...")
    df_avaliacoes = pd.read_csv("./dados/fat_avaliacoes_pedidos.csv")
    
    for col in ['data_comentario', 'data_resposta']:
        if col in df_avaliacoes.columns:
            df_avaliacoes[col] = pd.to_datetime(df_avaliacoes[col], errors='coerce')
            
    df_avaliacoes.to_sql('avaliacoes_pedidos', con=engine, if_exists='append', index=False)
    print("✅ Avaliações OK")
except Exception as e:
    print(f"❌ Erro em Avaliações: {e}")

print("\n🚀 Importação finalizada!")