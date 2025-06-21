import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import RelatorioData from "./RelatorioData";
import Relatorio from "./Relatorio";

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

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("=== CARREGANDO DADOS INICIAIS ===");
      
      // Aguardar mais tempo para o RelatorioData carregar do storage
      await new Promise(resolve => setTimeout(resolve, 500));

      // Carregar relatórios do RelatorioData local
      const response = await relatorioData.getAllRelatorios();
      
      console.log("Resposta do getAllRelatorios:", response);
      
      if (response.status === 200 && response.data) {
        console.log("Relatórios carregados no contexto:", response.data.length);
        console.log("Relatórios:", response.data);
        setRelatorios(response.data);
      } else {
        console.log("Nenhum relatório encontrado ou erro:", response.message);
        setRelatorios([]);
      }

    } catch (err) {
      console.error("Erro ao carregar dados iniciais:", err);
      setError("Erro ao carregar relatórios");
      setRelatorios([]);
    } finally {
      setLoading(false);
    }
  };

  const createRelatorio = async (
    relatorio: Relatorio
  ): Promise<{ status: number; data?: any; message?: string }> => {
    try {
      console.log("=== CRIANDO RELATÓRIO NO CONTEXTO ===");
      const response = await relatorioData.createRelatorio(relatorio);

      if (response.status === 200 && response.data) {
        const newRelatorio = response.data;
        console.log("Novo relatório criado:", newRelatorio);
        
        // Atualizar o estado local
        setRelatorios((prev) => {
          const updated = [...prev, newRelatorio];
          console.log("Relatórios atualizados no contexto:", updated.length);
          return updated;
        });
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
    console.log("=== BUSCANDO RELATÓRIOS POR PROJETO ===");
    console.log("projetoId:", projetoId);
    console.log("relatórios disponíveis:", relatorios.length);
    console.log("relatórios:", relatorios);
    
    const filtered = relatorios.filter((r) => r.projeto_id === projetoId && !r.deleted);
    console.log("relatórios filtrados:", filtered.length);
    return filtered;
  };

  const getRelatoriosByUsuario = (usuarioId: number): Relatorio[] => {
    console.log("=== BUSCANDO RELATÓRIOS POR USUÁRIO ===");
    console.log("usuarioId:", usuarioId);
    console.log("relatórios disponíveis:", relatorios.length);
    
    const filtered = relatorios.filter((r) => r.usuario_id === usuarioId && !r.deleted);
    console.log("relatórios filtrados:", filtered.length);
    return filtered;
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
      // Simular sincronização (não há servidor real)
      console.log("Sincronização de relatórios simulada");
    } catch (err) {
      console.error("Erro ao sincronizar relatórios:", err);
    }
  };

  const contextValue: RelatorioDataContextType = {
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
    <RelatorioDataContext.Provider value={contextValue}>
      {children}
    </RelatorioDataContext.Provider>
  );
};

export const useRelatorioData = (): RelatorioDataContextType => {
  const context = useContext(RelatorioDataContext);
  if (!context) {
    throw new Error("useRelatorioData deve ser usado dentro de um RelatorioDataProvider");
  }
  return context;
};
