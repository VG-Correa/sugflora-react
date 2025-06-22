import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import ColetaData from "./ColetaData";
import Coleta from "./Coleta";
import Message from "../../Messages/Message";
import { useColetaNotifications } from "../hooks/useColetaNotifications";

interface ColetaContextType {
  coletas: Coleta[];
  getColetaById: (id: number) => Message<Coleta>;
  getColetasByCampoId: (campo_id: number) => Message<Coleta[]>;
  getColetasIdentificadas: () => Message<Coleta[]>;
  getColetasNaoIdentificadas: () => Message<Coleta[]>;
  getColetasSolicitamAjuda: () => Message<Coleta[]>;
  getColetasPublicas: () => Message<Coleta[]>;
  getColetasParaIdentificacao: () => Message<any[]>;
  getColetasOutrosUsuarios: (usuarioLogadoId: number, campos: any[], projetos: any[]) => Message<any[]>;
  addColeta: (coleta: Coleta) => Promise<Message<Coleta>>;
  updateColeta: (coleta: Coleta) => Message<Coleta>;
  deleteColeta: (id: number) => Message<boolean>;
  identificarColeta: (id: number, especie_id: number) => Message<Coleta>;
  atualizarComSugestaoAceita: (coleta_id: number, familia_id: number | null, genero_id: number | null, especie_id: number | null, nome_comum: string | null) => Message<Coleta>;
}

const ColetaContext = createContext<ColetaContextType | undefined>(undefined);

export const useColetaData = () => {
  const context = useContext(ColetaContext);
  if (!context) {
    throw new Error(
      "useColetaData deve ser usado dentro de um ColetaDataProvider"
    );
  }
  return context;
};

export const ColetaDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const coletaService = useMemo(() => new ColetaData(), []);
  const [coletas, setColetas] = useState<Coleta[]>(
    coletaService.getAll().data || []
  );
  const { adicionarNotificacaoColetaAjuda, adicionarNotificacaoColetaNova } =
    useColetaNotifications();

  const getColetaById = useCallback(
    (id: number): Message<Coleta> => {
      return coletaService.getById(id);
    },
    [coletaService]
  );

  const getColetasByCampoId = useCallback(
    (campo_id: number): Message<Coleta[]> => {
      return coletaService.getByCampoId(campo_id);
    },
    [coletaService]
  );

  const getColetasIdentificadas = useCallback((): Message<Coleta[]> => {
    return coletaService.getIdentificadas();
  }, [coletaService]);

  const getColetasNaoIdentificadas = useCallback((): Message<Coleta[]> => {
    return coletaService.getNaoIdentificadas();
  }, [coletaService]);

  const getColetasSolicitamAjuda = useCallback((): Message<Coleta[]> => {
    return coletaService.getSolicitamAjuda();
  }, [coletaService]);

  const getColetasPublicas = useCallback((): Message<Coleta[]> => {
    return coletaService.getColetasPublicas();
  }, [coletaService]);

  const getColetasParaIdentificacao = useCallback((): Message<any[]> => {
    return coletaService.getColetasParaIdentificacao();
  }, [coletaService]);

  const getColetasOutrosUsuarios = useCallback(
    (usuarioLogadoId: number, campos: any[], projetos: any[]): Message<any[]> => {
      return coletaService.getColetasOutrosUsuarios(usuarioLogadoId, campos, projetos);
    },
    [coletaService]
  );

  const addColeta = useCallback(
    async (coleta: Coleta): Promise<Message<Coleta>> => {
      const result = coletaService.add(coleta);
      if (result.status === 201 && result.data) {
        setColetas([...coletaService.getAll().data!]);

        // Verifica se a coleta solicita ajuda para identificação
        if (coleta.solicita_ajuda_identificacao) {
          // Adiciona notificação de ajuda
          await adicionarNotificacaoColetaAjuda(result.data);
          console.log(
            "Notificação de ajuda adicionada para coleta:",
            result.data.nome
          );
        } else {
          // Adiciona notificação de nova coleta
          await adicionarNotificacaoColetaNova(result.data);
        }
      }
      return result;
    },
    [
      coletaService,
      adicionarNotificacaoColetaAjuda,
      adicionarNotificacaoColetaNova,
    ]
  );

  const updateColeta = useCallback(
    (coleta: Coleta): Message<Coleta> => {
      const result = coletaService.update(coleta);
      if (result.status === 200 && result.data) {
        setColetas([...coletaService.getAll().data!]);
      }
      return result;
    },
    [coletaService]
  );

  const deleteColeta = useCallback(
    (id: number): Message<boolean> => {
      const result = coletaService.delete(id);
      if (result.status === 200) {
        setColetas([...coletaService.getAll().data!]);
      }
      return result;
    },
    [coletaService]
  );

  const identificarColeta = useCallback(
    (id: number, especie_id: number): Message<Coleta> => {
      const result = coletaService.identificar(id, especie_id);
      if (result.status === 200 && result.data) {
        setColetas([...coletaService.getAll().data!]);
      }
      return result;
    },
    [coletaService]
  );

  const atualizarComSugestaoAceita = useCallback(
    (coleta_id: number, familia_id: number | null, genero_id: number | null, especie_id: number | null, nome_comum: string | null): Message<Coleta> => {
      const result = coletaService.atualizarComSugestaoAceita(coleta_id, familia_id, genero_id, especie_id, nome_comum);
      if (result.status === 200 && result.data) {
        setColetas([...coletaService.getAll().data!]);
      }
      return result;
    },
    [coletaService]
  );

  const value = {
    coletas,
    getColetaById,
    getColetasByCampoId,
    getColetasIdentificadas,
    getColetasNaoIdentificadas,
    getColetasSolicitamAjuda,
    getColetasPublicas,
    getColetasParaIdentificacao,
    getColetasOutrosUsuarios,
    addColeta,
    updateColeta,
    deleteColeta,
    identificarColeta,
    atualizarComSugestaoAceita,
  };

  return (
    <ColetaContext.Provider value={value}>{children}</ColetaContext.Provider>
  );
};
