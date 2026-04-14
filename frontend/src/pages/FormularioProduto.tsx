import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProdutos } from "@/contexts/ContextoProduto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";

const FormularioProduto = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idEdicao = searchParams.get("id"); 
  
  const { adicionarProduto, atualizarProduto, buscarProdutoPorId } = useProdutos();

  const produtoExistente = idEdicao ? buscarProdutoPorId(idEdicao) : undefined;

  const [form, setForm] = useState({
    nome_produto: produtoExistente?.nome_produto || "",
    categoria_produto: produtoExistente?.categoria_produto || "",
    peso_produto_gramas: produtoExistente?.peso_produto_gramas || 0,
    comprimento_centimetros: produtoExistente?.comprimento_centimetros || 0,
    altura_centimetros: produtoExistente?.altura_centimetros || 0,
    largura_centimetros: produtoExistente?.largura_centimetros || 0,
    imagem_url: produtoExistente?.imagem_url || "", // <-- Adicionado aqui!
  });

  useEffect(() => {
    if (produtoExistente) {
      Promise.resolve().then(() => {
        setForm({
          nome_produto: produtoExistente.nome_produto,
          categoria_produto: produtoExistente.categoria_produto,
          peso_produto_gramas: produtoExistente.peso_produto_gramas,
          comprimento_centimetros: produtoExistente.comprimento_centimetros,
          altura_centimetros: produtoExistente.altura_centimetros,
          largura_centimetros: produtoExistente.largura_centimetros,
          imagem_url: produtoExistente.imagem_url || "", // <-- Adicionado aqui!
        });
      });
    }
  }, [produtoExistente]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (idEdicao) {
      await atualizarProduto(idEdicao, form);
    } else {
      await adicionarProduto(form);
    }
    
    navigate("/produtos/gerenciar");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl animate-in fade-in duration-500">
      <Button 
        variant="ghost" 
        className="mb-6 gap-2 hover:bg-secondary" 
        onClick={() => navigate(-1)} 
      >
        <ArrowLeft size={16} /> Voltar
      </Button>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {idEdicao ? "Editar Produto" : "Cadastrar Novo Produto"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            {/* Informações Principais */}
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Produto</Label>
                <Input 
                  id="nome"
                  placeholder="Ex: Teclado Mecânico"
                  value={form.nome_produto} 
                  onChange={(e) => setForm({...form, nome_produto: e.target.value})} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Input 
                  id="categoria"
                  placeholder="Ex: Periféricos"
                  value={form.categoria_produto} 
                  onChange={(e) => setForm({...form, categoria_produto: e.target.value})} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imagem_url">URL da Imagem (Foto do Produto)</Label>
                <Input
                  id="imagem_url"
                  name="imagem_url"
                  placeholder="https://exemplo.com/foto-do-produto.jpg"
                  value={form.imagem_url || ""}
                  onChange={(e) => setForm({...form, imagem_url: e.target.value})}
                  className="border-slate-200 focus-visible:ring-indigo-500"
                />
                <p className="text-xs text-slate-500">Cole o link direto para a imagem do produto. Deixe em branco para usar o ícone padrão.</p>
              </div>              
            </div>

            {/* Logística e Dimensões */}
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
               <div className="space-y-2">
                <Label htmlFor="peso">Peso (gramas)</Label>
                <Input 
                  id="peso"
                  type="number" 
                  placeholder="0"
                  value={form.peso_produto_gramas || ""} 
                  onChange={(e) => setForm({...form, peso_produto_gramas: Number(e.target.value)})} 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="altura">Altura (cm)</Label>
                <Input 
                  id="altura"
                  type="number" 
                  placeholder="0"
                  value={form.altura_centimetros || ""} 
                  onChange={(e) => setForm({...form, altura_centimetros: Number(e.target.value)})} 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="largura">Largura (cm)</Label>
                <Input 
                  id="largura"
                  type="number" 
                  placeholder="0"
                  value={form.largura_centimetros || ""} 
                  onChange={(e) => setForm({...form, largura_centimetros: Number(e.target.value)})} 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comprimento">Comprimento (cm)</Label>
                <Input 
                  id="comprimento"
                  type="number" 
                  placeholder="0"
                  value={form.comprimento_centimetros || ""} 
                  onChange={(e) => setForm({...form, comprimento_centimetros: Number(e.target.value)})} 
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full gap-2 text-lg h-12 bg-indigo-600 hover:bg-indigo-700">
          <Save size={20} /> 
          {idEdicao ? "Salvar Alterações" : "Salvar Produto no Banco"}
        </Button>
      </form>
    </div>
  );
};

export default FormularioProduto;