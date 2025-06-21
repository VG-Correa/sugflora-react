import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import CampoData from "./CampoData";
import Campo from "./Campo";
import Message from "../../Messages/Message";

interface CampoContextType {
  campos: Campo[];
  getCampoById: (id: number) => Message<Campo>;
  getCamposByUsuarioId: (usuario_id: string) => Message<Campo[]>;
  getCamposByProjetoId: (projeto_id: number) => Message<Campo[]>;
  addCampo: (campo: Campo) => Message<Campo>;
  updateCampo: (campo: Campo) => Message<Campo>;
  deleteCampo: (id: number) => Message<boolean>;
}

const CampoContext = createContext<CampoContextType | undefined>(undefined);

export const useCampoData = () => {
  const context = useContext(CampoContext);
  if (!context) {
    throw new Error(
      "useCampoData deve ser usado dentro de um CampoDataProvider"
    );
  }
  return context;
};

export const CampoDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const campoService = useMemo(() => new CampoData(), []);
  const [campos, setCampos] = useState<Campo[]>([]);

  // Carregar dados iniciais
  useEffect(() => {
    const initialCampos = campoService.getAll().data || [];
    setCampos(initialCampos);
  }, [campoService]);

  const getCampoById = useCallback(
    (id: number): Message<Campo> => {
      return campoService.getById(id);
    },
    [campoService]
  );

  const getCamposByUsuarioId = useCallback(
    (usuario_id: string): Message<Campo[]> => {
      return campoService.getByUsuarioId(usuario_id);
    },
    [campoService]
  );

  const getCamposByProjetoId = useCallback(
    (projeto_id: number): Message<Campo[]> => {
      return campoService.getByProjetoId(projeto_id);
    },
    [campoService]
  );

  const addCampo = useCallback(
    (campo: Campo): Message<Campo> => {
      const result = campoService.add(campo);
      if (result.status === 201 && result.data) {
        // Atualizar o estado local
        setCampos((prev) => [...prev, result.data!]);
      }
      return result;
    },
    [campoService]
  );

  const updateCampo = useCallback(
    (campo: Campo): Message<Campo> => {
      // Sincronizar dados do estado local com a instância do CampoData
      campoService.syncCampos(campos);
      
      const result = campoService.update(campo);
      if (result.status === 200 && result.data) {
        // Atualizar o estado local
        setCampos((prev) =>
          prev.map((c) => (c.id === campo.id ? result.data! : c))
        );
      }
      return result;
    },
    [campoService, campos]
  );

  const deleteCampo = useCallback(
    (id: number): Message<boolean> => {
      const result = campoService.delete(id);
      if (result.status === 200) {
        // Atualizar o estado local
        setCampos((prev) => prev.filter((c) => c.id !== id));
      }
      return result;
    },
    [campoService]
  );

  const value = {
    campos,
    getCampoById,
    getCamposByUsuarioId,
    getCamposByProjetoId,
    addCampo,
    updateCampo,
    deleteCampo,
  };

  return (
    <CampoContext.Provider value={value}>{children}</CampoContext.Provider>
  );
};
