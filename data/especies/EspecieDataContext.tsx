import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import EspecieData from "./EspecieData";
import Especie from "./Especie";
import Message from "../../Messages/Message";

interface EspecieContextType {
  especies: Especie[];
  getEspecieById: (id: number) => Message<Especie>;
  getEspeciesByGenero: (genero_id: number) => Message<Especie[]>;
  searchEspeciesByNome: (nome: string) => Message<Especie[]>;
  addEspecie: (especie: Especie) => Message<Especie>;
  updateEspecie: (especie: Especie) => Message<Especie>;
  deleteEspecie: (id: number) => Message<boolean>;
}

const EspecieContext = createContext<EspecieContextType | undefined>(undefined);

export const useEspecieData = () => {
  const context = useContext(EspecieContext);
  if (!context) {
    throw new Error(
      "useEspecieData deve ser usado dentro de um EspecieDataProvider"
    );
  }
  return context;
};

export const EspecieDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const especieService = useMemo(() => new EspecieData(), []);
  const [especies, setEspecies] = useState<Especie[]>(
    especieService.getAll().data || []
  );

  const getEspecieById = useCallback(
    (id: number): Message<Especie> => {
      return especieService.getById(id);
    },
    [especieService]
  );

  const getEspeciesByGenero = useCallback(
    (genero_id: number): Message<Especie[]> => {
      return especieService.getByGenero(genero_id);
    },
    [especieService]
  );

  const searchEspeciesByNome = useCallback(
    (nome: string): Message<Especie[]> => {
      return especieService.searchByNome(nome);
    },
    [especieService]
  );

  const addEspecie = useCallback(
    (especie: Especie): Message<Especie> => {
      const result = especieService.add(especie);
      if (result.status === 201 && result.data) {
        setEspecies([...especieService.getAll().data!]);
      }
      return result;
    },
    [especieService]
  );

  const updateEspecie = useCallback(
    (especie: Especie): Message<Especie> => {
      const result = especieService.update(especie);
      if (result.status === 200 && result.data) {
        setEspecies([...especieService.getAll().data!]);
      }
      return result;
    },
    [especieService]
  );

  const deleteEspecie = useCallback(
    (id: number): Message<boolean> => {
      const result = especieService.delete(id);
      if (result.status === 200) {
        setEspecies([...especieService.getAll().data!]);
      }
      return result;
    },
    [especieService]
  );

  const value = {
    especies,
    getEspecieById,
    getEspeciesByGenero,
    searchEspeciesByNome,
    addEspecie,
    updateEspecie,
    deleteEspecie,
  };

  return (
    <EspecieContext.Provider value={value}>{children}</EspecieContext.Provider>
  );
};
