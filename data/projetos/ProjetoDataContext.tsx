import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import ProjetoData from "./ProjetoData";
import Projeto from "./Projeto";
import Message from "../../Messages/Message";

interface ProjetoContextType {
  projetos: Projeto[];
  getProjetoById: (id: number) => Message<Projeto>;
  getProjetosByUsuarioDono: (usuario_dono_uuid: string) => Message<Projeto[]>;
  addProjeto: (projeto: Projeto) => Message<Projeto>;
  updateProjeto: (projeto: Projeto) => Message<Projeto>;
  deleteProjeto: (id: number) => Message<boolean>;
}

const ProjetoDataContext = createContext<ProjetoContextType | null>(null);

export const useProjetoData = () => {
  const context = useContext(ProjetoDataContext);
  if (!context) {
    throw new Error(
      "useProjetoData deve ser usado dentro de ProjetoDataProvider"
    );
  }
  return context;
};

export const ProjetoDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const projetoService = useMemo(() => new ProjetoData(), []);
  const [projetos, setProjetos] = useState<Projeto[]>(
    projetoService.getAll().data || []
  );

  const getProjetoById = useCallback(
    (id: number): Message<Projeto> => {
      return projetoService.getById(id);
    },
    [projetoService]
  );

  const getProjetosByUsuarioDono = useCallback(
    (usuario_dono_uuid: string): Message<Projeto[]> => {
      return projetoService.getByUsuarioDono(usuario_dono_uuid);
    },
    [projetoService]
  );

  const addProjeto = useCallback(
    (projeto: Projeto): Message<Projeto> => {
      const result = projetoService.add(projeto);
      if (result.status === 201 && result.data) {
        setProjetos([...projetoService.getAll().data!]);
      }
      return result;
    },
    [projetoService]
  );

  const updateProjeto = useCallback(
    (projeto: Projeto): Message<Projeto> => {
      const result = projetoService.update(projeto);
      if (result.status === 200 && result.data) {
        setProjetos([...projetoService.getAll().data!]);
      }
      return result;
    },
    [projetoService]
  );

  const deleteProjeto = useCallback(
    (id: number): Message<boolean> => {
      const result = projetoService.delete(id);
      if (result.status === 200) {
        setProjetos([...projetoService.getAll().data!]);
      }
      return result;
    },
    [projetoService]
  );

  const contextValue = useMemo(
    () => ({
      projetos,
      getProjetoById,
      getProjetosByUsuarioDono,
      addProjeto,
      updateProjeto,
      deleteProjeto,
    }),
    [
      projetos,
      getProjetoById,
      getProjetosByUsuarioDono,
      addProjeto,
      updateProjeto,
      deleteProjeto,
    ]
  );

  return (
    <ProjetoDataContext.Provider value={contextValue}>
      {children}
    </ProjetoDataContext.Provider>
  );
};
