from fastapi import FastAPI
from app.api.routers import produtos

app = FastAPI(
    title="API do Sistema de E-Commerce",
    description="API para gerenciamento de produtos, pedidos e avaliações.",
    version="1.0.0",
)

@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "API rodando com sucesso!"}

# Incluindo as rotas no app
app.include_router(produtos.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)