import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import ProjetoData from './ProjetoData'; // Use o nome correto se for ProjetoData
import Projeto from './Projeto'; // Importe a classe Projeto
import Message from '../../Messages/Message'; // Importe a classe Message
import Usuario from '../usuarios/Usuario';

// Definir o tipo do contexto para incluir os dados e as funções que alteram esses dados
interface ProjetoContextType {
    projetos: Projeto[];
    currentProjeto: Projeto | null;
    setCurrentProjeto: React.Dispatch<React.SetStateAction<Projeto | null>>;
    addProjeto: (projeto: Projeto) => Message<Projeto>;
    updateProjeto: (projeto: Projeto) => Message<Projeto>; // Adicionado: Atualizar projeto
    deleteProjeto: (id: number) => Message<boolean>; // Adicionado: Deletar projeto
    getProjetoById: (id: number) => Message<Projeto>; // Adicionado: Buscar projeto por ID
    getProjetosByUsuario: (usuario: Usuario) => Projeto[]; // Adicionado: Buscar projetos por usuárioª
}

const ProjetoDataContext = createContext<ProjetoContextType | null>(null);

export const useProjetoData = () => {
    const context = useContext(ProjetoDataContext);
    if (!context) {
        throw new Error("useProjetoData deve ser usado dentro de ProjetoDataProvider");
    }
    return context;
};

const ProjetoDataProvider = ({ children }: { children: React.ReactNode }) => {
    const projetoService = useMemo(() => new ProjetoData(), []);

    const [projetos, setProjetos] = useState<Projeto[]>(projetoService.getAll().data || []);
    const [currentProjeto, setCurrentProjeto] = useState<Projeto | null>(null);

    // Função para adicionar projeto que atualiza o estado
    const addProjeto = useCallback((projeto: Projeto): Message<Projeto> => {
        const result = projetoService.add(projeto);
        if (result.status === 201 && result.data) { // Verifique 201 para "Created"
            setProjetos([...projetoService.getAll().data!]); // Atualiza a lista de projetos no estado React
        }
        return result;
    }, [projetoService]);

    // Adicionado: Função para atualizar projeto
    const updateProjeto = useCallback((projeto: Projeto): Message<Projeto> => {
        const result = projetoService.update(projeto); // Assumindo que você terá um método `update` em ProjetoData
        if (result.status === 200 && result.data) {
            setProjetos([...projetoService.getAll().data!]);
            if (currentProjeto && currentProjeto.id === projeto.id) {
                setCurrentProjeto(projeto); // Atualiza o projeto se for o mesmo que está sendo editado
            }
        }
        return result;
    }, [projetoService, currentProjeto]);

    // Adicionado: Função para deletar projeto
    const deleteProjeto = useCallback((id: number): Message<boolean> => {
        const result = projetoService.delete(projetoService.getById(id).data); // Assumindo que você terá um método `delete` em ProjetoData
        if (result.status === 200) {
            setProjetos([...projetoService.getAll().data!]);
            if (currentProjeto && currentProjeto.id === id) {
                setCurrentProjeto(null); // Retira o projeto se ele mesmo for deletado
            }
        }
        return result;
    }, [projetoService, currentProjeto]);

    // Adicionado: Função para buscar projeto por ID
    const getProjetoById = useCallback((id: number): Message<Projeto> => {
        return projetoService.getById(id); // Assumindo que você terá um método `getById` em ProjetoData
    }, [projetoService]);

    const getProjetosByUsuario = useCallback((usuario: Usuario): Projeto[] => {
        return projetoService.getByUsuario(usuario).data || [];
    }, [projetoService]);


    const contextValue = useMemo(() => ({
        projetos,
        currentProjeto,
        setCurrentProjeto,
        addProjeto,
        updateProjeto,
        deleteProjeto,
        getProjetoById,
        getProjetosByUsuario,
    }), [projetos, currentProjeto, setCurrentProjeto, addProjeto, updateProjeto, deleteProjeto, getProjetoById, getProjetosByUsuario]);

    return (
        <ProjetoDataContext.Provider value={contextValue}>
            {children}
        </ProjetoDataContext.Provider>
    );
};

export default ProjetoDataProvider;