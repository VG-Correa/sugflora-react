import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import RelatorioData from "./RelatorioData";
import Relatorio from "./Relatorio";
import PersistenceService from "../services/PersistenceService";
import CacheService from "../services/CacheService";
import SyncService from "../services/SyncService";

interface RelatorioDataContextType {
  relatorios: Relatorio[];
  loading: boolean;
  error: string | null;
  createRelatorio: (
    relatorio: Relatorio
  ) => Promise<{ status: number; data?: any; message?: string }>;
  updateRelatorio: (
    relatorio: Relatorio
  ) => Promise<{ status: number; data?: any; message?: string }>;
  deleteRelatorio: (
    id: number
  ) => Promise<{ status: number; data?: any; message?: string }>;
  getRelatorioById: (id: number) => Relatorio | undefined;
  getRelatoriosByProjeto: (projetoId: number) => Relatorio[];
  getRelatoriosByUsuario: (usuarioId: number) => Relatorio[];
  gerarRelatorio: (
    relatorio: Relatorio
  ) => Promise<{ status: number; data?: any; message?: string }>;
  refreshRelatorios: () => Promise<void>;
  syncRelatorios: () => Promise<void>;
}

const RelatorioDataContext = createContext<
  RelatorioDataContextType | undefined
>(undefined);

interface RelatorioDataProviderProps {
  children: ReactNode;
}

export const RelatorioDataProvider: React.FC<RelatorioDataProviderProps> = ({
  children,
}) => {
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const relatorioData = new RelatorioData();
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
      const cachedRelatorios = cacheService.get("relatorios");
      if (cachedRelatorios) {
        setRelatorios(
          cachedRelatorios.map(
            (r: any) =>
              new Relatorio(
                r.id,
                r.titulo,
                r.descricao,
                r.tipo,
                r.projeto_id,
                r.usuario_id,
                r.data_inicio,
                r.data_fim,
                r.status,
                r.arquivo_url,
                r.created_at,
                r.updated_at,
                r.deleted
              )
          )
        );
        setLoading(false);
        return;
      }

      // Se não há cache, carregar da persistência local
      const persistedRelatorios = await persistenceService.loadRelatorios();
      if (persistedRelatorios) {
        const relatorioObjects = persistedRelatorios.map(
          (r: any) =>
            new Relatorio(
              r.id,
              r.titulo,
              r.descricao,
              r.tipo,
              r.projeto_id,
              r.usuario_id,
              r.data_inicio,
              r.data_fim,
              r.status,
              r.arquivo_url,
              r.created_at,
              r.updated_at,
              r.deleted
            )
        );
        setRelatorios(relatorioObjects);
        cacheService.set("relatorios", relatorioObjects, 5 * 60 * 1000); // 5 minutos
      }

      // Tentar sincronizar com o servidor
      await syncRelatorios();
    } catch (err) {
      console.error("Erro ao carregar dados iniciais:", err);
      setError("Erro ao carregar relatórios");
    } finally {
      setLoading(false);
    }
  };

  const createRelatorio = async (
    relatorio: Relatorio
  ): Promise<{ status: number; data?: any; message?: string }> => {
    try {
      const response = await relatorioData.createRelatorio(relatorio);

      if (response.status === 200 && response.data) {
        const newRelatorio = new Relatorio(
          response.data.id,
          response.data.titulo,
          response.data.descricao,
          response.data.tipo,
          response.data.projeto_id,
          response.data.usuario_id,
          response.data.data_inicio,
          response.data.data_fim,
          response.data.status,
          response.data.arquivo_url,
          response.data.created_at,
          response.data.updated_at,
          response.data.deleted
        );

        setRelatorios((prev) => [...prev, newRelatorio]);

        // Atualizar persistência e cache
        await persistenceService.saveRelatorios([...relatorios, newRelatorio]);
        cacheService.set(
          "relatorios",
          [...relatorios, newRelatorio],
          5 * 60 * 1000
        );

        // Invalidar cache relacionado
        cacheService.invalidateRelated("relatorios");
      }

      return response;
    } catch (err) {
      console.error("Erro ao criar relatório:", err);
      return { status: 500, message: "Erro interno do servidor" };
    }
  };

  const updateRelatorio = async (
    relatorio: Relatorio
  ): Promise<{ status: number; data?: any; message?: string }> => {
    try {
      const response = await relatorioData.updateRelatorio(relatorio);

      if (response.status === 200) {
        setRelatorios((prev) =>
          prev.map((r) => (r.id === relatorio.id ? relatorio : r))
        );

        // Atualizar persistência e cache
        await persistenceService.saveRelatorios(
          relatorios.map((r) => (r.id === relatorio.id ? relatorio : r))
        );
        cacheService.set(
          "relatorios",
          relatorios.map((r) => (r.id === relatorio.id ? relatorio : r)),
          5 * 60 * 1000
        );

        // Invalidar cache relacionado
        cacheService.invalidateRelated("relatorios");
      }

      return response;
    } catch (err) {
      console.error("Erro ao atualizar relatório:", err);
      return { status: 500, message: "Erro interno do servidor" };
    }
  };

  const deleteRelatorio = async (
    id: number
  ): Promise<{ status: number; data?: any; message?: string }> => {
    try {
      const response = await relatorioData.deleteRelatorio(id);

      if (response.status === 200) {
        setRelatorios((prev) => prev.filter((r) => r.id !== id));

        // Atualizar persistência e cache
        await persistenceService.saveRelatorios(
          relatorios.filter((r) => r.id !== id)
        );
        cacheService.set(
          "relatorios",
          relatorios.filter((r) => r.id !== id),
          5 * 60 * 1000
        );

        // Invalidar cache relacionado
        cacheService.invalidateRelated("relatorios");
      }

      return response;
    } catch (err) {
      console.error("Erro ao deletar relatório:", err);
      return { status: 500, message: "Erro interno do servidor" };
    }
  };

  const getRelatorioById = (id: number): Relatorio | undefined => {
    return relatorios.find((r) => r.id === id);
  };

  const getRelatoriosByProjeto = (projetoId: number): Relatorio[] => {
    return relatorios.filter((r) => r.projeto_id === projetoId && !r.deleted);
  };

  const getRelatoriosByUsuario = (usuarioId: number): Relatorio[] => {
    return relatorios.filter((r) => r.usuario_id === usuarioId && !r.deleted);
  };

  const gerarRelatorio = async (
    relatorio: Relatorio
  ): Promise<{ status: number; data?: any; message?: string }> => {
    try {
      const response = await relatorioData.gerarRelatorio(relatorio);

      if (response.status === 200) {
        // Atualizar o relatório com a URL do arquivo gerado
        const updatedRelatorio = {
          ...relatorio,
          arquivo_url: response.data?.arquivo_url,
        };
        setRelatorios((prev) =>
          prev.map((r) => (r.id === relatorio.id ? updatedRelatorio : r))
        );

        // Atualizar persistência e cache
        await persistenceService.saveRelatorios(
          relatorios.map((r) => (r.id === relatorio.id ? updatedRelatorio : r))
        );
        cacheService.set(
          "relatorios",
          relatorios.map((r) => (r.id === relatorio.id ? updatedRelatorio : r)),
          5 * 60 * 1000
        );

        // Invalidar cache relacionado
        cacheService.invalidateRelated("relatorios");
      }

      return response;
    } catch (err) {
      console.error("Erro ao gerar relatório:", err);
      return { status: 500, message: "Erro interno do servidor" };
    }
  };

  const refreshRelatorios = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Limpar cache para forçar recarregamento
      cacheService.delete("relatorios");

      // Recarregar dados
      await loadInitialData();
    } catch (err) {
      console.error("Erro ao atualizar relatórios:", err);
      setError("Erro ao atualizar relatórios");
    } finally {
      setLoading(false);
    }
  };

  const syncRelatorios = async (): Promise<void> => {
    try {
      await syncService.syncRelatorios();

      // Recarregar dados após sincronização
      const persistedRelatorios = await persistenceService.loadRelatorios();
      if (persistedRelatorios) {
        const relatorioObjects = persistedRelatorios.map(
          (r: any) =>
            new Relatorio(
              r.id,
              r.titulo,
              r.descricao,
              r.tipo,
              r.projeto_id,
              r.usuario_id,
              r.data_inicio,
              r.data_fim,
              r.status,
              r.arquivo_url,
              r.created_at,
              r.updated_at,
              r.deleted
            )
        );
        setRelatorios(relatorioObjects);
        cacheService.set("relatorios", relatorioObjects, 5 * 60 * 1000);
      }
    } catch (err) {
      console.error("Erro na sincronização de relatórios:", err);
      // Não definir erro aqui, pois a sincronização pode falhar sem afetar o uso offline
    }
  };

  const value: RelatorioDataContextType = {
    relatorios,
    loading,
    error,
    createRelatorio,
    updateRelatorio,
    deleteRelatorio,
    getRelatorioById,
    getRelatoriosByProjeto,
    getRelatoriosByUsuario,
    gerarRelatorio,
    refreshRelatorios,
    syncRelatorios,
  };

  return (
    <RelatorioDataContext.Provider value={value}>
      {children}
    </RelatorioDataContext.Provider>
  );
};

export const useRelatorioData = (): RelatorioDataContextType => {
  const context = useContext(RelatorioDataContext);
  if (context === undefined) {
    throw new Error(
      "useRelatorioData deve ser usado dentro de um RelatorioDataProvider"
    );
  }
  return context;
};
