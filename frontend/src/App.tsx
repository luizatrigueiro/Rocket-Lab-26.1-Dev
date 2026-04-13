import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProvedorProduto } from "@/contexts/ContextoProduto";
import { Toaster } from "@/components/ui/toaster";
import { Navegacao } from "@/components/Navegacao"; 
import Inicio from "./pages/Inicio";
import FormularioProduto from "./pages/FormularioProduto";
import GerenciarProdutos from "./pages/GerenciarProdutos";

const App = () => {
  return (
    <ProvedorProduto>
      <BrowserRouter>
        <Navegacao />
        
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/produtos/gerenciar" element={<GerenciarProdutos />} />
          <Route path="/produtos/novo" element={<FormularioProduto />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <Toaster />
      </BrowserRouter>
    </ProvedorProduto>
  );
};

export default App;