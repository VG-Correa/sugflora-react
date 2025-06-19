import AsyncStorage from "@react-native-async-storage/async-storage";

class PersistenceService {
  private static instance: PersistenceService;

  // Chaves para armazenamento
  private static readonly KEYS = {
    USUARIOS: "sugflora_usuarios",
    PROJETOS: "sugflora_projetos",
    CAMPOS: "sugflora_campos",
    COLETAS: "sugflora_coletas",
    FAMILIAS: "sugflora_familias",
    GENEROS: "sugflora_generos",
    ESPECIES: "sugflora_especies",
    NOTIFICACOES: "sugflora_notificacoes",
    RELATORIOS: "sugflora_relatorios",
    LAST_SYNC: "sugflora_last_sync",
  };

  private constructor() {}

  public static getInstance(): PersistenceService {
    if (!PersistenceService.instance) {
      PersistenceService.instance = new PersistenceService();
    }
    return PersistenceService.instance;
  }

  // Métodos genéricos para salvar e carregar dados
  async saveData<T>(key: string, data: T): Promise<void> {
    try {
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonData);
      console.log(`Dados salvos com sucesso: ${key}`);
    } catch (error) {
      console.error(`Erro ao salvar dados (${key}):`, error);
      throw new Error(`Falha ao salvar dados: ${error}`);
    }
  }

  async loadData<T>(key: string): Promise<T | null> {
    try {
      const jsonData = await AsyncStorage.getItem(key);
      if (jsonData) {
        const data = JSON.parse(jsonData);
        console.log(`Dados carregados com sucesso: ${key}`);
        return data;
      }
      return null;
    } catch (error) {
      console.error(`Erro ao carregar dados (${key}):`, error);
      return null;
    }
  }

  async removeData(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`Dados removidos com sucesso: ${key}`);
    } catch (error) {
      console.error(`Erro ao remover dados (${key}):`, error);
      throw new Error(`Falha ao remover dados: ${error}`);
    }
  }

  // Métodos específicos para cada entidade
  async saveUsuarios(usuarios: any[]): Promise<void> {
    return this.saveData(PersistenceService.KEYS.USUARIOS, usuarios);
  }

  async loadUsuarios(): Promise<any[] | null> {
    return this.loadData<any[]>(PersistenceService.KEYS.USUARIOS);
  }

  async saveProjetos(projetos: any[]): Promise<void> {
    return this.saveData(PersistenceService.KEYS.PROJETOS, projetos);
  }

  async loadProjetos(): Promise<any[] | null> {
    return this.loadData<any[]>(PersistenceService.KEYS.PROJETOS);
  }

  async saveCampos(campos: any[]): Promise<void> {
    return this.saveData(PersistenceService.KEYS.CAMPOS, campos);
  }

  async loadCampos(): Promise<any[] | null> {
    return this.loadData<any[]>(PersistenceService.KEYS.CAMPOS);
  }

  async saveColetas(coletas: any[]): Promise<void> {
    return this.saveData(PersistenceService.KEYS.COLETAS, coletas);
  }

  async loadColetas(): Promise<any[] | null> {
    return this.loadData<any[]>(PersistenceService.KEYS.COLETAS);
  }

  async saveFamilias(familias: any[]): Promise<void> {
    return this.saveData(PersistenceService.KEYS.FAMILIAS, familias);
  }

  async loadFamilias(): Promise<any[] | null> {
    return this.loadData<any[]>(PersistenceService.KEYS.FAMILIAS);
  }

  async saveGeneros(generos: any[]): Promise<void> {
    return this.saveData(PersistenceService.KEYS.GENEROS, generos);
  }

  async loadGeneros(): Promise<any[] | null> {
    return this.loadData<any[]>(PersistenceService.KEYS.GENEROS);
  }

  async saveEspecies(especies: any[]): Promise<void> {
    return this.saveData(PersistenceService.KEYS.ESPECIES, especies);
  }

  async loadEspecies(): Promise<any[] | null> {
    return this.loadData<any[]>(PersistenceService.KEYS.ESPECIES);
  }

  async saveNotificacoes(notificacoes: any[]): Promise<void> {
    return this.saveData(PersistenceService.KEYS.NOTIFICACOES, notificacoes);
  }

  async loadNotificacoes(): Promise<any[] | null> {
    return this.loadData<any[]>(PersistenceService.KEYS.NOTIFICACOES);
  }

  async saveRelatorios(relatorios: any[]): Promise<void> {
    return this.saveData(PersistenceService.KEYS.RELATORIOS, relatorios);
  }

  async loadRelatorios(): Promise<any[] | null> {
    return this.loadData<any[]>(PersistenceService.KEYS.RELATORIOS);
  }

  // Métodos para sincronização
  async saveLastSync(timestamp: string): Promise<void> {
    return this.saveData(PersistenceService.KEYS.LAST_SYNC, timestamp);
  }

  async getLastSync(): Promise<string | null> {
    return this.loadData<string>(PersistenceService.KEYS.LAST_SYNC);
  }

  // Método para limpar todos os dados
  async clearAllData(): Promise<void> {
    try {
      const keys = Object.values(PersistenceService.KEYS);
      await AsyncStorage.multiRemove(keys);
      console.log("Todos os dados foram removidos com sucesso");
    } catch (error) {
      console.error("Erro ao limpar dados:", error);
      throw new Error(`Falha ao limpar dados: ${error}`);
    }
  }

  // Método para obter informações de armazenamento
  async getStorageInfo(): Promise<{ used: number; total: number }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;

      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }

      return {
        used: totalSize,
        total: 6 * 1024 * 1024, // 6MB é o limite típico do AsyncStorage
      };
    } catch (error) {
      console.error("Erro ao obter informações de armazenamento:", error);
      return { used: 0, total: 0 };
    }
  }
}

export default PersistenceService;
