# 🛒 Sistema de Gerenciamento de E-Commerce

Desenvolvimento de um módulo gerencial de E-commerce full-stack. Este sistema permite que gerentes de loja visualizem seu catálogo de produtos, acompanhem o desempenho de vendas, leiam avaliações de clientes e analisem métricas logísticas, além de realizar a gestão completa (CRUD) do inventário.

---

## 🚀 Tecnologias Utilizadas

**Frontend:**
* **React + Vite** com **TypeScript**
* **Estilização:** Tailwind CSS e componentes baseados no [Shadcn UI](https://ui.shadcn.com/)
* **Gerenciamento de Estado:** Context API
* **Requisições HTTP:** Axios
* **Arquitetura Visual:** Atomic Design (Atoms, Molecules, Organisms, Pages)

**Backend:**
* **FastAPI** (Python)
* **SQLAlchemy** (ORM) para modelagem e consultas complexas
* **Pydantic** para validação de dados (Schemas)
* **Alembic** para migrações
* **Banco de Dados:** SQLite

---

## ✨ Funcionalidades e Diferenciais

O projeto atende a todos os requisitos propostos e inclui diversas implementações avançadas para garantir escalabilidade, performance e melhor experiência do usuário:

### 📦 Gestão e Catálogo
* **CRUD Completo:** Criação (com UUID único), listagem, edição e exclusão de produtos refletidos em tempo real.
* **Vitrine Inteligente:** Catálogo com barra de busca case-insensitive e pílulas de filtragem por categorias e avaliação mínima (estrelas).
* **Alta Performance (Paginação Full-Stack):** Sistema nativo de no backend com botão "Carregar Mais" no frontend, permitindo navegação fluida por mais de 33.000 itens sem travar o navegador.

### 📊 Dashboard e Métricas Avançadas
* **Consultas Relacionais Dinâmicas:** Uso de agregações no SQLAlchemy para calcular total de vendas e média de avaliações em tempo real.
* **Inteligência Logística:**
  * Ranking geográfico identificando o Estado (UF) do vendedor principal de cada produto.

### 🎨 Experiência do Usuário (UI/UX)
* Telas exclusivas para Vitrine (`Inicio.tsx`), Gestão (`GerenciarProdutos.tsx`), Edição (`FormularioProduto.tsx`) e Dashboard (`DetalhesProduto.tsx`).
* **Tratamento de Erros e Feedbacks:** Alertas visuais flutuantes (*Toasts*) e modais de confirmação de exclusão (*AlertDialog*).
* **Resiliência:** Tratamento de *Fallback* para substituir automaticamente URLs de imagens quebradas por ícones padrão.

---

## 🛠️ Passo a Passo para Executar a Aplicação

Para rodar este projeto localmente, é necessário executar o Backend e o Frontend simultaneamente em terminais separados.

### Pré-requisitos
* Node.js instalado (para o Frontend)
* Python 3.9+ instalado (para o Backend)

### 1. Clonando o Repositório
```bash
git clone https://github.com/luizatrigueiro/Rocket-Lab-26.1-Dev.git
```
### 2. Configurando o Backend

Abra o seu terminal na pasta raiz do projeto e siga os passos:
```bash
# Crie o ambiente virtual
python -m venv .venv

# Ative o ambiente virtual
# No Windows:
.venv\Scripts\activate
# No Mac/Linux:
source .venv/bin/activate

# Instale as dependências do Python
pip install -r requirements.txt

# Inicie o servidor FastAPI
uvicorn app.main:app --reload
```
A API estará rodando em http://127.0.0.1:8000. A documentação interativa (Swagger) pode ser acessada em http://127.0.0.1:8000/docs.

### 3. Configurando o Frontend

Abra um novo terminal na pasta raiz do projeto (não feche o terminal do backend) e execute:
```bash
# Instale as dependências do Node usando pnpm
pnpm install

# Inicie o servidor de desenvolvimento do Vite
pnpm dev
```
## 📌 Autoria
Desenvolvido por **Luiza Trigueiro**
- [https://www.linkedin.com/in/luiza-trigueiro/]
- [https://github.com/luizatrigueiro]
