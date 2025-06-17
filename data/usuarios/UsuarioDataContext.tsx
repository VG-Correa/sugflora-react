import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import UsuarioData from './UsuarioData'; // Use o nome correto se for UsuarioData
import Usuario from './Usuario'; // Importe a classe Usuario
import Message from '../../Messages/Message'; // Importe a classe Message

// Definir o tipo do contexto para incluir os dados e as funções que alteram esses dados
interface UsuarioContextType {
  usuarios: Usuario[]; 
  currentUser: Usuario | null;
  login: (username: string, senha: string) => Message<Usuario>;
  addUsuario: (usuario: Usuario) => Message<Usuario>;
  updateUsuario: (usuario: Usuario) => Message<Usuario>; // Adicionado: Atualizar usuário
  deleteUsuario: (id: number) => Message<boolean>; // Adicionado: Deletar usuário
  getUsuarioById: (id: number) => Message<Usuario>; // Adicionado: Buscar usuário por ID
  logout: () => void; // Adicionado: Logout do usuário
}

const UsuarioDataContext = createContext<UsuarioContextType | null>(null);

export const useUsuarioData = () => {
  const context = useContext(UsuarioDataContext);
  if (!context) {
    throw new Error("useUsuarioData deve ser usado dentro de UsuarioDataProvider");
  }
  return context;
};

const UsuarioDataProvider = ({ children }: { children: React.ReactNode }) => {
  const usuarioService = useMemo(() => new UsuarioData(), []);

  const [usuarios, setUsuarios] = useState<Usuario[]>(usuarioService.getAll().data || []);
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);

  // Função para lidar com o login que atualiza o estado
  const login = useCallback((username: string, senha: string): Message<Usuario> => {
    console.log("Usuarios para login: ", usuarioService.getAll())
    const result = usuarioService.login(username, senha);
    if (result.status === 200 && result.data) {
      setCurrentUser(result.data);
    }
    return result;
  }, [usuarioService]);

  // Função para logout
  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  // Função para adicionar usuário que atualiza o estado
  const addUsuario = useCallback((usuario: Usuario): Message<Usuario> => {
    const result = usuarioService.add(usuario);
    if (result.status === 201 && result.data) { // Verifique 201 para "Created"
      setUsuarios([...usuarioService.getAll().data!]); // Atualiza a lista de usuários no estado React
    }
    return result;
  }, [usuarioService]);

  // Adicionado: Função para atualizar usuário
  const updateUsuario = useCallback((usuario: Usuario): Message<Usuario> => {
    const result = usuarioService.update(usuario); // Assumindo que você terá um método `update` em UsuarioData
    if (result.status === 200 && result.data) {
      setUsuarios([...usuarioService.getAll().data!]);
      if (currentUser && currentUser.id === usuario.id) {
        setCurrentUser(usuario); // Atualiza o usuário logado se for o mesmo que está sendo editado
      }
    }
    return result;
  }, [usuarioService, currentUser]);

  // Adicionado: Função para deletar usuário
  const deleteUsuario = useCallback((id: number): Message<boolean> => {
    const result = usuarioService.delete(id); // Assumindo que você terá um método `delete` em UsuarioData
    if (result.status === 200) {
      setUsuarios([...usuarioService.getAll().data!]);
      if (currentUser && currentUser.id === id) {
        setCurrentUser(null); // Desloga o usuário se ele mesmo for deletado
      }
    }
    return result;
  }, [usuarioService, currentUser]);

  // Adicionado: Função para buscar usuário por ID
  const getUsuarioById = useCallback((id: number): Message<Usuario> => {
    return usuarioService.getById(id); // Assumindo que você terá um método `getById` em UsuarioData
  }, [usuarioService]);


  const contextValue = useMemo(() => ({
    usuarios,
    currentUser,
    login,
    logout,
    addUsuario,
    updateUsuario,
    deleteUsuario,
    getUsuarioById,
  }), [usuarios, currentUser, login, logout, addUsuario, updateUsuario, deleteUsuario, getUsuarioById]);

  return (
    <UsuarioDataContext.Provider value={contextValue}>
      {children}
    </UsuarioDataContext.Provider>
  );
};

export default UsuarioDataProvider;