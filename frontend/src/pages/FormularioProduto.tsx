import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProdutos } from "@/contexts/ContextoProduto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";

const FormularioProduto = () => {
  const navigate = useNavigate();
  const { adicionarProduto } = useProdutos();

  const [form, setForm] = useState({
    nome_produto: "",
    categoria_produto: "",
    peso_produto_gramas: 0,
    comprimento_centimetros: 0,
    altura_centimetros: 0,
    largura_centimetros: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await adicionarProduto(form);
    // Após salvar, volta para a tela de gerenciamento
    navigate("/produtos/gerenciar");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl animate-in fade-in duration-500">
      <Button 
        variant="ghost" 
        className="mb-6 gap-2 hover:bg-secondary" 
        onClick={() => navigate("/produtos/gerenciar")}
      >
        <ArrowLeft size={16} /> Voltar para Gerenciamento
      </Button>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Cadastrar Novo Produto</CardTitle>
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
            </div>

            {/* Logística e Dimensões */}
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
               <div className="space-y-2">
                <Label htmlFor="peso">Peso (gramas)</Label>
                <Input 
                  id="peso"
                  type="number" 
                  placeholder="0"
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
                  onChange={(e) => setForm({...form, comprimento_centimetros: Number(e.target.value)})} 
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full gap-2 text-lg h-12">
          <Save size={20} /> Salvar Produto no Banco
        </Button>
      </form>
    </div>
  );
};

export default FormularioProduto;