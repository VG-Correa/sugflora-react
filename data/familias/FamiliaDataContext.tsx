import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import FamiliaData from "./FamiliaData";
import Familia from "./Familia";
import Message from "../../Messages/Message";

interface FamiliaContextType {
  familias: Familia[];
  getFamiliaById: (id: number) => Message<Familia>;
  addFamilia: (familia: Familia) => Message<Familia>;
  updateFamilia: (familia: Familia) => Message<Familia>;
  deleteFamilia: (id: number) => Message<boolean>;
}

const FamiliaContext = createContext<FamiliaContextType | undefined>(undefined);

export const useFamiliaData = () => {
  const context = useContext(FamiliaContext);
  if (!context) {
    throw new Error(
      "useFamiliaData deve ser usado dentro de um FamiliaDataProvider"
    );
  }
  return context;
};

export const FamiliaDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const familiaService = useMemo(() => new FamiliaData(), []);
  const [familias, setFamilias] = useState<Familia[]>(
    familiaService.getAll().data || []
  );

  const getFamiliaById = useCallback(
    (id: number): Message<Familia> => {
      return familiaService.getById(id);
    },
    [familiaService]
  );

  const addFamilia = useCallback(
    (familia: Familia): Message<Familia> => {
      const result = familiaService.add(familia);
      if (result.status === 201 && result.data) {
        setFamilias([...familiaService.getAll().data!]);
      }
      return result;
    },
    [familiaService]
  );

  const updateFamilia = useCallback(
    (familia: Familia): Message<Familia> => {
      const result = familiaService.update(familia);
      if (result.status === 200 && result.data) {
        setFamilias([...familiaService.getAll().data!]);
      }
      return result;
    },
    [familiaService]
  );

  const deleteFamilia = useCallback(
    (id: number): Message<boolean> => {
      const result = familiaService.delete(id);
      if (result.status === 200) {
        setFamilias([...familiaService.getAll().data!]);
      }
      return result;
    },
    [familiaService]
  );

  const value = {
    familias,
    getFamiliaById,
    addFamilia,
    updateFamilia,
    deleteFamilia,
  };

  return (
    <FamiliaContext.Provider value={value}>{children}</FamiliaContext.Provider>
  );
};
