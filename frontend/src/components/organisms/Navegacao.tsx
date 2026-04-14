import { Link, useLocation } from "react-router-dom";
import { Package, Settings, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/atoms/button";

export const Navegacao = () => {
  const local = useLocation();

  const links = [
    { nome: "Vitrine", path: "/", icone: ShoppingBag },
    { nome: "Gerenciar", path: "/produtos/gerenciar", icone: Settings },
  ];

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Package className="text-white" size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">ShopManager</span>
        </div>

        {/* Links Centrais */}
        <div className="hidden md:flex items-center gap-1 bg-slate-50 p-1 rounded-xl border">
          {links.map(link => {
            const Ativo = local.pathname === link.path;
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  Ativo ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <link.icone size={16} />
                {link.nome}
              </Link>
            );
          })}
        </div>

        {/* Botão de Ação */}
        <Button asChild className="rounded-full bg-indigo-600 hover:bg-indigo-700 gap-2">
          <Link to="/produtos/novo">
            <Plus size={16} /> Novo Produto
          </Link>
        </Button>
      </div>
    </nav>
  );
};