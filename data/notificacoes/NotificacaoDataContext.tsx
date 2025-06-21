import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import NotificacaoData from "./NotificacaoData";
import Notificacao from "./Notificacao";
import PersistenceService from "../services/PersistenceService";
import CacheService from "../services/CacheService";
import SyncService from "../services/SyncService";

interface NotificacaoDataContextType {
  notificacoes: Notificacao[];
  loading: boolean;
  error: string | null;
  createNotificacao: (
    notificacao: Notificacao
  ) => Promise<{ status: number; data?: any; message?: string }>;
  updateNotificacao: (
    notificacao: Notificacao
  ) => Promise<{ status: number; data?: any; message?: string }>;
  deleteNotificacao: (
    id: number
  ) => Promise<{ status: number; data?: any; message?: string }>;
  getNotificacaoById: (id: number) => Notificacao | undefined;
  getNotificacoesByUsuario: (usuarioId: number) => Notificacao[];
  marcarComoLida: (
    id: number
  ) => Promise<{ status: number; data?: any; message?: string }>;
  refreshNotificacoes: () => Promise<void>;
  syncNotificacoes: () => Promise<void>;
}

const NotificacaoDataContext = createContext<
  NotificacaoDataContextType | undefined
>(undefined);

interface NotificacaoDataProviderProps {
  children: ReactNode;
}

export const NotificacaoDataProvider: React.FC<
  NotificacaoDataProviderProps
> = ({ children }) => {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const notificacaoData = new NotificacaoData();
  const persistenceService = PersistenceService.getInstance();
  const cacheService = CacheService.getInstance();
  const syncService = SyncService.getInstance();

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Tentar carregar do cache primeiro
      const cachedNotificacoes = cacheService.get("notificacoes");
      if (cachedNotificacoes) {
        setNotificacoes(
          cachedNotificacoes.map(
            (n: any) =>
              new Notificacao(
                n.id,
                n.titulo,
                n.mensagem,
                n.tipo,
                n.usuario_id,
                n.lida,
                n.created_at,
                n.updated_at,
                n.deleted
              )
          )
        );
        setLoading(false);
        return;
      }

      // Se não há cache, carregar da persistência local
      const persistedNotificacoes = await persistenceService.loadNotificacoes();
      if (persistedNotificacoes) {
        const notificacaoObjects = persistedNotificacoes.map(
          (n: any) =>
            new Notificacao(
              n.id,
              n.titulo,
              n.mensagem,
              n.tipo,
              n.usuario_id,
              n.lida,
              n.created_at,
              n.updated_at,
              n.deleted
            )
        );
        setNotificacoes(notificacaoObjects);
        cacheService.set("notificacoes", notificacaoObjects, 5 * 60 * 1000); // 5 minutos
      }

      // Tentar sincronizar com o servidor
      await syncNotificacoes();
    } catch (err) {
      console.error("Erro ao carregar dados iniciais:", err);
      setError("Erro ao carregar notificações");
    } finally {
      setLoading(false);
    }
  };

  const createNotificacao = async (
    notificacao: Notificacao
  ): Promise<{ status: number; data?: any; message?: string }> => {
    try {
      const response = await notificacaoData.createNotificacao(notificacao);

      if (response.status === 200 && response.data) {
        const newNotificacao = new Notificacao(
          response.data.id,
          response.data.titulo,
          response.data.mensagem,
          response.data.tipo,
          response.data.usuario_id,
          response.data.lida,
          response.data.created_at,
          response.data.updated_at,
          response.data.deleted
        );

        setNotificacoes((prev) => [...prev, newNotificacao]);

        // Atualizar persistência e cache
        await persistenceService.saveNotificacoes([
          ...notificacoes,
          newNotificacao,
        ]);
        cacheService.set(
          "notificacoes",
          [...notificacoes, newNotificacao],
          5 * 60 * 1000
        );

        // Invalidar cache relacionado
        cacheService.invalidateRelated("notificacoes");
      }

      return response;
    } catch (err) {
      console.error("Erro ao criar notificação:", err);
      return { status: 500, message: "Erro interno do servidor" };
    }
  };

  const updateNotificacao = async (
    notificacao: Notificacao
  ): Promise<{ status: number; data?: any; message?: string }> => {
    try {
      const response = await notificacaoData.updateNotificacao(notificacao);

      if (response.status === 200) {
        setNotificacoes((prev) =>
          prev.map((n) => (n.id === notificacao.id ? notificacao : n))
        );

        // Atualizar persistência e cache
        await persistenceService.saveNotificacoes(
          notificacoes.map((n) => (n.id === notificacao.id ? notificacao : n))
        );
        cacheService.set(
          "notificacoes",
          notificacoes.map((n) => (n.id === notificacao.id ? notificacao : n)),
          5 * 60 * 1000
        );

        // Invalidar cache relacionado
        cacheService.invalidateRelated("notificacoes");
      }

      return response;
    } catch (err) {
      console.error("Erro ao atualizar notificação:", err);
      return { status: 500, message: "Erro interno do servidor" };
    }
  };

  const deleteNotificacao = async (
    id: number
  ): Promise<{ status: number; data?: any; message?: string }> => {
    try {
      const response = await notificacaoData.deleteNotificacao(id);

      if (response.status === 200) {
        setNotificacoes((prev) => prev.filter((n) => n.id !== id));

        // Atualizar persistência e cache
        await persistenceService.saveNotificacoes(
          notificacoes.filter((n) => n.id !== id)
        );
        cacheService.set(
          "notificacoes",
          notificacoes.filter((n) => n.id !== id),
          5 * 60 * 1000
        );

        // Invalidar cache relacionado
        cacheService.invalidateRelated("notificacoes");
      }

      return response;
    } catch (err) {
      console.error("Erro ao deletar notificação:", err);
      return { status: 500, message: "Erro interno do servidor" };
    }
  };

  const getNotificacaoById = (id: number): Notificacao | undefined => {
    return notificacoes.find((n) => n.id === id);
  };

  const getNotificacoesByUsuario = (usuarioId: number): Notificacao[] => {
    return notificacoes.filter((n) => n.usuario_id === usuarioId && !n.deleted);
  };

  const marcarComoLida = async (
    id: number
  ): Promise<{ status: number; data?: any; message?: string }> => {
    try {
      const response = await notificacaoData.marcarComoLida(id);

      if (response.status === 200) {
        setNotificacoes((prev) =>
          prev.map((n) =>
            n.id === id
              ? { ...n, lida: true, updated_at: new Date().toISOString() }
              : n
          )
        );

        // Atualizar persistência e cache
        const updatedNotificacoes = notificacoes.map((n) =>
          n.id === id
            ? { ...n, lida: true, updated_at: new Date().toISOString() }
            : n
        );
        await persistenceService.saveNotificacoes(updatedNotificacoes);
        cacheService.set("notificacoes", updatedNotificacoes, 5 * 60 * 1000);

        // Invalidar cache relacionado
        cacheService.invalidateRelated("notificacoes");
      }

      return response;
    } catch (err) {
      console.error("Erro ao marcar notificação como lida:", err);
      return { status: 500, message: "Erro interno do servidor" };
    }
  };

  const refreshNotificacoes = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Limpar cache para forçar recarregamento
      cacheService.delete("notificacoes");

      // Recarregar dados
      await loadInitialData();
    } catch (err) {
      console.error("Erro ao atualizar notificações:", err);
      setError("Erro ao atualizar notificações");
    } finally {
      setLoading(false);
    }
  };

  const syncNotificacoes = async (): Promise<void> => {
    try {
      await syncService.syncNotificacoes();

      // Recarregar dados após sincronização
      const persistedNotificacoes = await persistenceService.loadNotificacoes();
      if (persistedNotificacoes) {
        const notificacaoObjects = persistedNotificacoes.map(
          (n: any) =>
            new Notificacao(
              n.id,
              n.titulo,
              n.mensagem,
              n.tipo,
              n.usuario_id,
              n.lida,
              n.created_at,
              n.updated_at,
              n.deleted
            )
        );
        setNotificacoes(notificacaoObjects);
        cacheService.set("notificacoes", notificacaoObjects, 5 * 60 * 1000);
      }
    } catch (err) {
      console.error("Erro na sincronização de notificações:", err);
      // Não definir erro aqui, pois a sincronização pode falhar sem afetar o uso offline
    }
  };

  const value: NotificacaoDataContextType = {
    notificacoes,
    loading,
    error,
    createNotificacao,
    updateNotificacao,
    deleteNotificacao,
    getNotificacaoById,
    getNotificacoesByUsuario,
    marcarComoLida,
    refreshNotificacoes,
    syncNotificacoes,
  };

  return (
    <NotificacaoDataContext.Provider value={value}>
      {children}
    </NotificacaoDataContext.Provider>
  );
};

export const useNotificacaoData = (): NotificacaoDataContextType => {
  const context = useContext(NotificacaoDataContext);
  if (context === undefined) {
    throw new Error(
      "useNotificacaoData deve ser usado dentro de um NotificacaoDataProvider"
    );
  }
  return context;
};
