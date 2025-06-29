import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import SugestaoIdentificacaoData from "./SugestaoIdentificacaoData";
import SugestaoIdentificacao from "./SugestaoIdentificacao";
import Message from "../../Messages/Message";
import { useColetaData } from "../coletas/ColetaDataContext";

interface SugestaoIdentificacaoContextType {
  sugestoes: SugestaoIdentificacao[];
  getSugestaoById: (id: number) => Message<SugestaoIdentificacao>;
  getSugestoesByColetaId: (coleta_id: number) => Message<SugestaoIdentificacao[]>;
  getSugestoesByUsuarioId: (usuario_id: number) => Message<SugestaoIdentificacao[]>;
  getSugestoesPendentes: () => Message<SugestaoIdentificacao[]>;
  addSugestao: (sugestao: SugestaoIdentificacao) => Message<SugestaoIdentificacao>;
  updateSugestao: (sugestao: SugestaoIdentificacao) => Message<SugestaoIdentificacao>;
  deleteSugestao: (id: number) => Message<boolean>;
  updateStatusSugestao: (id: number, status: 'pendente' | 'aceita' | 'rejeitada' | 'em_analise') => Message<SugestaoIdentificacao>;
  getSugestoesCompletas: () => Message<any[]>;
}

const SugestaoIdentificacaoContext = createContext<SugestaoIdentificacaoContextType | undefined>(undefined);

export const useSugestaoIdentificacaoData = () => {
  const context = useContext(SugestaoIdentificacaoContext);
  if (!context) {
    throw new Error(
      "useSugestaoIdentificacaoData deve ser usado dentro de um SugestaoIdentificacaoDataProvider"
    );
  }
  return context;
};

export const SugestaoIdentificacaoDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const sugestaoService = useMemo(() => new SugestaoIdentificacaoData(), []);
  const [sugestoes, setSugestoes] = useState<SugestaoIdentificacao[]>(
    sugestaoService.getAll().data || []
  );
  
  // Usar o contexto de coletas para atualizar a coleta quando necessário
  const { atualizarComSugestaoAceita } = useColetaData();

  const getSugestaoById = useCallback(
    (id: number): Message<SugestaoIdentificacao> => {
      return sugestaoService.getById(id);
    },
    [sugestaoService]
  );

  const getSugestoesByColetaId = useCallback(
    (coleta_id: number): Message<SugestaoIdentificacao[]> => {
      return sugestaoService.getByColetaId(coleta_id);
    },
    [sugestaoService]
  );

  const getSugestoesByUsuarioId = useCallback(
    (usuario_id: number): Message<SugestaoIdentificacao[]> => {
      return sugestaoService.getByUsuarioId(usuario_id);
    },
    [sugestaoService]
  );

  const getSugestoesPendentes = useCallback((): Message<SugestaoIdentificacao[]> => {
    return sugestaoService.getPendentes();
  }, [sugestaoService]);

  const addSugestao = useCallback(
    (sugestao: SugestaoIdentificacao): Message<SugestaoIdentificacao> => {
      const result = sugestaoService.add(sugestao);
      if (result.status === 201 && result.data) {
        setSugestoes([...sugestaoService.getAll().data!]);
      }
      return result;
    },
    [sugestaoService]
  );

  const updateSugestao = useCallback(
    (sugestao: SugestaoIdentificacao): Message<SugestaoIdentificacao> => {
      const result = sugestaoService.update(sugestao);
      if (result.status === 200 && result.data) {
        setSugestoes([...sugestaoService.getAll().data!]);
      }
      return result;
    },
    [sugestaoService]
  );

  const deleteSugestao = useCallback(
    (id: number): Message<boolean> => {
      const result = sugestaoService.delete(id);
      if (result.status === 200) {
        setSugestoes([...sugestaoService.getAll().data!]);
      }
      return result;
    },
    [sugestaoService]
  );

  const updateStatusSugestao = useCallback(
    (id: number, status: 'pendente' | 'aceita' | 'rejeitada' | 'em_analise'): Message<SugestaoIdentificacao> => {
      const result = sugestaoService.updateStatus(id, status);
      if (result.status === 200 && result.data) {
        setSugestoes([...sugestaoService.getAll().data!]);
        
        // Se a sugestão foi aceita, atualizar a coleta correspondente
        if (status === 'aceita' && result.data) {
          const sugestao = result.data;
          
          // Atualizar a coleta com os dados da sugestão aceita
          const resultadoColeta = atualizarComSugestaoAceita(
            sugestao.coleta_id,
            sugestao.familia_sugerida_id,
            sugestao.genero_sugerido_id,
            sugestao.especie_sugerida_id,
            sugestao.nome_comum_sugerido
          );
          
          if (resultadoColeta.status !== 200) {
            console.error('Erro ao atualizar coleta:', resultadoColeta.message);
          }
        }
      }
      return result;
    },
    [sugestaoService, atualizarComSugestaoAceita]
  );

  const getSugestoesCompletas = useCallback((): Message<any[]> => {
    return sugestaoService.getSugestoesCompletas();
  }, [sugestaoService]);

  const value = {
    sugestoes,
    getSugestaoById,
    getSugestoesByColetaId,
    getSugestoesByUsuarioId,
    getSugestoesPendentes,
    addSugestao,
    updateSugestao,
    deleteSugestao,
    updateStatusSugestao,
    getSugestoesCompletas,
  };

  return (
    <SugestaoIdentificacaoContext.Provider value={value}>
      {children}
    </SugestaoIdentificacaoContext.Provider>
  );
}; 