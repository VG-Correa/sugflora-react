import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import UsuarioData from "./UsuarioData";
import Usuario from "./Usuario";
import PersistenceService from "../services/PersistenceService";
import CacheService from "../services/CacheService";
import SyncService from "../services/SyncService";

interface UsuarioDataContextType {
  usuarios: Usuario[];
  loading: boolean;
  error: string | null;
  createUsuario: (
    usuario: Usuario
  ) => Promise<{ status: number; data?: any; message?: string }>;
  addUsuario: (
    usuario: Usuario
  ) => Promise<{ status: number; data?: any; message?: string }>;
  updateUsuario: (
    usuario: Usuario
  ) => Promise<{ status: number; data?: any; message?: string }>;
  deleteUsuario: (
    id: number
  ) => Promise<{ status: number; data?: any; message?: string }>;
  getUsuarioById: (id: number) => Usuario | undefined;
  getUsuarioByEmail: (email: string) => Usuario | undefined;
  getUsuariosByProjeto: (projetoId: number) => Usuario[];
  login: (
    username: string,
    password: string
  ) => Promise<{ status: number; data?: any; message?: string }>;
  refreshUsuarios: () => Promise<void>;
  syncUsuarios: () => Promise<void>;
}

const UsuarioDataContext = createContext<UsuarioDataContextType | undefined>(
  undefined
);

interface UsuarioDataProviderProps {
  children: ReactNode;
}

export const UsuarioDataProvider: React.FC<UsuarioDataProviderProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Usar uma instância única do UsuarioData
  const [usuarioData] = useState(() => new UsuarioData());
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuarioData.getAll().data || []);
  const persistenceService = PersistenceService.getInstance();
  const cacheService = CacheService.getInstance();
  const syncService = SyncService.getInstance();

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Tentar carregar do cache primeiro
      const cachedUsuarios = cacheService.get("usuarios") as Usuario[] | null;
      if (cachedUsuarios) {
        setUsuarios(
          cachedUsuarios.map(
            (u) =>
              new Usuario(
                u.id,
                u.nome,
                u.sobrenome,
                u.username,
                u.senha,
                u.rg,
                u.cpf,
                u.endereco,
                u.email,
                u.role
              )
          )
        );
        setLoading(false);
        return;
      }

      // Se não há cache, carregar da persistência local
      const persistedUsuarios = await persistenceService.loadUsuarios();
      if (persistedUsuarios) {
        const usuarioObjects = persistedUsuarios.map(
          (u) =>
            new Usuario(
              u.id,
              u.nome,
              u.sobrenome,
              u.username,
              u.senha,
              u.rg,
              u.cpf,
              u.endereco,
              u.email,
              u.role
            )
        );
        setUsuarios(usuarioObjects);
        cacheService.setUsuarios(usuarioObjects);
      }

      // Não fazer sincronização automática para evitar sobrescrever dados locais
      // A sincronização será feita manualmente quando necessário
    } catch (err) {
      console.error("Erro ao carregar dados iniciais:", err);
      setError("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  const createUsuario = async (
    usuario: Usuario
  ): Promise<{ status: number; data?: any; message?: string }> => {
    try {
      // Sincronizar dados do estado local com a instância do UsuarioData
      usuarioData.usuarios = [...usuarios];

      const response = usuarioData.add(usuario);

      if (response.status === 201 && response.data) {
        const newUsuario = new Usuario(
          response.data.id,
          response.data.nome,
          response.data.sobrenome,
          response.data.username,
          response.data.senha,
          response.data.rg,
          response.data.cpf,
          response.data.endereco,
          response.data.email,
          response.data.role
        );

        setUsuarios((prev) => [...prev, newUsuario]);

        // Atualizar persistência e cache
        await persistenceService.saveUsuarios([...usuarios, newUsuario]);
        cacheService.setUsuarios([...usuarios, newUsuario]);

        // Invalidar cache relacionado
        cacheService.invalidateRelated("usuarios");
      }

      return {
        status: response.status,
        data: response.data,
        message: response.message,
      };
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      return { status: 500, message: "Erro interno do servidor" };
    }
  };

  const updateUsuario = async (
    usuario: Usuario
  ): Promise<{ status: number; data?: any; message?: string }> => {
    try {
      console.log(
        "Usuários no estado local:",
        usuarios.map((u) => ({ id: u.id, nome: u.nome }))
      );
      console.log("Tentando atualizar usuário:", usuario.id, usuario.nome);

      // Primeiro, sincronizar os dados do estado local com a instância do UsuarioData
      usuarioData.usuarios = [...usuarios];
      console.log(
        "Usuários na instância do UsuarioData:",
        usuarioData.usuarios.map((u) => ({ id: u.id, nome: u.nome }))
      );

      const response = usuarioData.update(usuario);
      console.log("Resposta da atualização:", response);

      if (response.status === 200) {
        // Atualizar o estado local
        setUsuarios((prev) =>
          prev.map((u) => (u.id === usuario.id ? response.data : u))
        );
      }

      return {
        status: response.status,
        data: response.data,
        message: response.message,
      };
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      return { status: 500, message: "Erro interno do servidor" };
    }
  };

  const deleteUsuario = async (
    id: number
  ): Promise<{ status: number; data?: any; message?: string }> => {
    try {
      // Sincronizar dados do estado local com a instância do UsuarioData
      usuarioData.usuarios = [...usuarios];

      const response = usuarioData.delete(id);

      if (response.status === 200) {
        setUsuarios((prev) => prev.filter((u) => u.id !== id));

        // Atualizar persistência e cache
        await persistenceService.saveUsuarios(
          usuarios.filter((u) => u.id !== id)
        );
        cacheService.setUsuarios(usuarios.filter((u) => u.id !== id));

        // Invalidar cache relacionado
        cacheService.invalidateRelated("usuarios");
      }

      return {
        status: response.status,
        data: response.data,
        message: response.message,
      };
    } catch (err) {
      console.error("Erro ao deletar usuário:", err);
      return { status: 500, message: "Erro interno do servidor" };
    }
  };

  const getUsuarioById = (id: number): Usuario | undefined => {
    return usuarios.find((u) => u.id === id);
  };

  const getUsuarioByEmail = (email: string): Usuario | undefined => {
    return usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase());
  };

  const getUsuariosByProjeto = (projetoId: number): Usuario[] => {
    const usuarios = [new Usuario(0, "Exemplo", "Usuário", "exemplo", "senha", "RG", "CPF", "Endereço","","")]
    
    // Implementar lógica para buscar usuários por projeto
    // Isso pode requerer uma relação muitos-para-muitos
    return usuarios.filter((u) => !u.deleted) as Usuario[];
  };

  const refreshUsuarios = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Limpar cache para forçar recarregamento
      cacheService.delete("usuarios");

      // Recarregar dados
      await loadInitialData();
    } catch (err) {
      console.error("Erro ao atualizar usuários:", err);
      setError("Erro ao atualizar usuários");
    } finally {
      setLoading(false);
    }
  };

  const syncUsuarios = async (): Promise<void> => {
    try {
      await syncService.syncUsuarios();

      // Recarregar dados após sincronização
      const persistedUsuarios = await persistenceService.loadUsuarios();
      if (persistedUsuarios) {
        const usuarioObjects = persistedUsuarios.map(
          (u) =>
            new Usuario(
              u.id,
              u.nome,
              u.sobrenome,
              u.username,
              u.senha,
              u.rg,
              u.cpf,
              u.endereco,
              u.email,
              u.role
            )
        );
        setUsuarios(usuarioObjects);
        cacheService.setUsuarios(usuarioObjects);
      }
    } catch (err) {
      console.error("Erro na sincronização de usuários:", err);
      // Não definir erro aqui, pois a sincronização pode falhar sem afetar o uso offline
    }
  };

  const login = async (
    username: string,
    password: string
  ): Promise<{ status: number; data?: any; message?: string }> => {
    try {
      // Buscar usuário no estado local
      console.log("Tentando fazer login com:", username, password);
      console.log("Usuários no estado local:", usuarios);
      const usuario = usuarios.find((u) => u.username === username);
      console.log("Usuário encontrado:", usuario);
      if (usuario) {
        if (usuario.senha === password) {
          return {
            status: 200,
            data: usuario,
            message: "Login efetuado com sucesso",
          };
        } else {
          return {
            status: 403,
            message: "Credenciais incorretas!",
          };
        }
      } else {
        return {
          status: 403,
          message: "Credenciais incorretas!",
        };
      }
    } catch (err) {
      console.error("Erro no login:", err);
      return { status: 500, message: "Erro interno do servidor" };
    }
  };

  const value: UsuarioDataContextType = {
    usuarios,
    loading,
    error,
    createUsuario,
    addUsuario: createUsuario,
    updateUsuario,
    deleteUsuario,
    getUsuarioById,
    getUsuarioByEmail,
    getUsuariosByProjeto,
    login,
    refreshUsuarios,
    syncUsuarios,
  };

  return (
    <UsuarioDataContext.Provider value={value}>
      {children}
    </UsuarioDataContext.Provider>
  );
};

export const useUsuarioData = (): UsuarioDataContextType => {
  const context = useContext(UsuarioDataContext);
  if (context === undefined) {
    throw new Error(
      "useUsuarioData deve ser usado dentro de um UsuarioDataProvider"
    );
  }
  return context;
};
