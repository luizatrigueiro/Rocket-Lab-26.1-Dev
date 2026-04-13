import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const LIMITE_TOAST = 1;
const ATRASO_REMOCAO_TOAST = 5000;

type NotificacaoToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

let contador = 0;

function gerarId() {
  contador = (contador + 1) % Number.MAX_SAFE_INTEGER;
  return contador.toString();
}

type Acao =
  | { type: "ADICIONAR_TOAST"; toast: NotificacaoToast }
  | { type: "ATUALIZAR_TOAST"; toast: Partial<NotificacaoToast> }
  | { type: "IGNORAR_TOAST"; idToast?: string }
  | { type: "REMOVER_TOAST"; idToast?: string };

interface Estado {
  toasts: NotificacaoToast[];
}

const timeoutsDoToast = new Map<string, ReturnType<typeof setTimeout>>();

const adicionarFilaRemocao = (idToast: string) => {
  if (timeoutsDoToast.has(idToast)) return;

  const timeout = setTimeout(() => {
    timeoutsDoToast.delete(idToast);
    despachar({ type: "REMOVER_TOAST", idToast });
  }, ATRASO_REMOCAO_TOAST);

  timeoutsDoToast.set(idToast, timeout);
};

export const redutor = (estado: Estado, acao: Acao): Estado => {
  switch (acao.type) {
    case "ADICIONAR_TOAST":
      return { ...estado, toasts: [acao.toast, ...estado.toasts].slice(0, LIMITE_TOAST) };
    case "ATUALIZAR_TOAST":
      return {
        ...estado,
        toasts: estado.toasts.map((t) => (t.id === acao.toast.id ? { ...t, ...acao.toast } : t)),
      };
    case "IGNORAR_TOAST": {
      const { idToast } = acao;
      if (idToast) adicionarFilaRemocao(idToast);
      else estado.toasts.forEach((t) => adicionarFilaRemocao(t.id));
      return {
        ...estado,
        toasts: estado.toasts.map((t) => (t.id === idToast || idToast === undefined ? { ...t, open: false } : t)),
      };
    }
    case "REMOVER_TOAST":
      if (acao.idToast === undefined) return { ...estado, toasts: [] };
      return { ...estado, toasts: estado.toasts.filter((t) => t.id !== acao.idToast) };
    default:
      return estado;
  }
};

const ouvintes: Array<(estado: Estado) => void> = [];
let estadoEmMemoria: Estado = { toasts: [] };

function despachar(acao: Acao) {
  estadoEmMemoria = redutor(estadoEmMemoria, acao);
  ouvintes.forEach((ouvinte) => ouvinte(estadoEmMemoria));
}

function toast({ ...props }: Omit<NotificacaoToast, "id">) {
  const id = gerarId();
  const update = (props: NotificacaoToast) => despachar({ type: "ATUALIZAR_TOAST", toast: { ...props, id } });
  const dismiss = () => despachar({ type: "IGNORAR_TOAST", idToast: id });

  despachar({
    type: "ADICIONAR_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => { if (!open) dismiss(); },
    },
  });

  return { id, dismiss, update };
}

function useToast() {
  const [estado, setEstado] = React.useState<Estado>(estadoEmMemoria);

  React.useEffect(() => {
    ouvintes.push(setEstado);
    return () => {
      const indice = ouvintes.indexOf(setEstado);
      if (indice > -1) ouvintes.splice(indice, 1);
    };
  }, [estado]);

  return { ...estado, toast, dismiss: (idToast?: string) => despachar({ type: "IGNORAR_TOAST", idToast }) };
}

export { useToast, toast };