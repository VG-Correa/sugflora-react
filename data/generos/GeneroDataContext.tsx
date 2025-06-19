import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import GeneroData from "./GeneroData";
import Genero from "./Genero";
import Message from "../../Messages/Message";

interface GeneroContextType {
  generos: Genero[];
  getGeneroById: (id: number) => Message<Genero>;
  getGenerosByFamilia: (familia_id: number) => Message<Genero[]>;
  addGenero: (genero: Genero) => Message<Genero>;
  updateGenero: (genero: Genero) => Message<Genero>;
  deleteGenero: (id: number) => Message<boolean>;
}

const GeneroContext = createContext<GeneroContextType | undefined>(undefined);

export const useGeneroData = () => {
  const context = useContext(GeneroContext);
  if (!context) {
    throw new Error(
      "useGeneroData deve ser usado dentro de um GeneroDataProvider"
    );
  }
  return context;
};

export const GeneroDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const generoService = useMemo(() => new GeneroData(), []);
  const [generos, setGeneros] = useState<Genero[]>(
    generoService.getAll().data || []
  );

  const getGeneroById = useCallback(
    (id: number): Message<Genero> => {
      return generoService.getById(id);
    },
    [generoService]
  );

  const getGenerosByFamilia = useCallback(
    (familia_id: number): Message<Genero[]> => {
      return generoService.getByFamilia(familia_id);
    },
    [generoService]
  );

  const addGenero = useCallback(
    (genero: Genero): Message<Genero> => {
      const result = generoService.add(genero);
      if (result.status === 201 && result.data) {
        setGeneros([...generoService.getAll().data!]);
      }
      return result;
    },
    [generoService]
  );

  const updateGenero = useCallback(
    (genero: Genero): Message<Genero> => {
      const result = generoService.update(genero);
      if (result.status === 200 && result.data) {
        setGeneros([...generoService.getAll().data!]);
      }
      return result;
    },
    [generoService]
  );

  const deleteGenero = useCallback(
    (id: number): Message<boolean> => {
      const result = generoService.delete(id);
      if (result.status === 200) {
        setGeneros([...generoService.getAll().data!]);
      }
      return result;
    },
    [generoService]
  );

  const value = {
    generos,
    getGeneroById,
    getGenerosByFamilia,
    addGenero,
    updateGenero,
    deleteGenero,
  };

  return (
    <GeneroContext.Provider value={value}>{children}</GeneroContext.Provider>
  );
};
