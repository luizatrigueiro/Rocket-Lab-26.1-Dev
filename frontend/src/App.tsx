import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProvedorProduto } from "@/contexts/ContextoProduto";
import { Toaster } from "@/components/ui/toaster";
import { Navegacao } from "@/components/Navegacao"; 
import Inicio from "./pages/Inicio";
import FormularioProduto from "./pages/FormularioProduto";
import GerenciarProdutos from "./pages/GerenciarProdutos";
import DetalhesProduto from "./pages/DetalhesProduto";

const App = () => {
  return (
    <ProvedorProduto>
      <BrowserRouter>
        <Navegacao />
        
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/produtos/gerenciar" element={<GerenciarProdutos />} />
          <Route path="/produtos/novo" element={<FormularioProduto />} />
          <Route path="/produtos/:id" element={<DetalhesProduto />} /> 
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/" element={<Inicio />} />
        </Routes>
        
        <Toaster />
      </BrowserRouter>
    </ProvedorProduto>
  );
};

export default App;