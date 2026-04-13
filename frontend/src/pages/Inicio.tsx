import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Inicio = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold text-center">Sistema E-Commerce</h1>
      <div className="flex gap-4">
        <Button onClick={() => navigate("/produtos/gerenciar")}>Gerenciar Produtos</Button>
        <Button variant="outline" onClick={() => navigate("/produtos/novo")}>Cadastrar Novo</Button>
      </div>
    </div>
  );
};

export default Inicio;