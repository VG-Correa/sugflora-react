import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PersistenceService from "./PersistenceService";

interface SyncConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

class SyncService {
  private static instance: SyncService;
  private persistenceService: PersistenceService;
  private config: SyncConfig;
  private isOnline: boolean = true;

  private constructor() {
    this.persistenceService = PersistenceService.getInstance();
    this.config = {
      baseURL: "http://localhost:8080/api",
      timeout: 10000,
      retryAttempts: 3,
      retryDelay: 1000,
    };
  }

  public static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  // Configurar o serviço
  public configure(config: Partial<SyncConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // Verificar conectividade
  public async checkConnectivity(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.config.baseURL}/health`, {
        timeout: 3000,
      });
      this.isOnline = response.status === 200;
      return this.isOnline;
    } catch (error) {
      this.isOnline = false;
      return false;
    }
  }

  // Obter token de autenticação
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem("token");
    } catch (error) {
      console.error("Erro ao obter token:", error);
      return null;
    }
  }

  // Criar instância do axios com configurações
  private createAxiosInstance() {
    return axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Método genérico para requisições com retry
  private async makeRequest<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    endpoint: string,
    data?: any,
    attempt: number = 1
  ): Promise<T> {
    try {
      const token = await this.getAuthToken();
      const axiosInstance = this.createAxiosInstance();

      if (token) {
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
      }

      const response = await axiosInstance.request({
        method,
        url: endpoint,
        data,
      });

      return response.data;
    } catch (error: any) {
      if (
        error.code === "NETWORK_ERROR" ||
        error.message?.includes("Network Error")
      ) {
        if (attempt < this.config.retryAttempts) {
          console.log(
            `Tentativa ${attempt} falhou (offline), tentando novamente...`
          );
          await new Promise((resolve) =>
            setTimeout(resolve, this.config.retryDelay)
          );
          return this.makeRequest(method, endpoint, data, attempt + 1);
        } else {
          throw new Error("Servidor offline");
        }
      }

      if (attempt < this.config.retryAttempts) {
        console.log(`Tentativa ${attempt} falhou, tentando novamente...`);
        await new Promise((resolve) =>
          setTimeout(resolve, this.config.retryDelay)
        );
        return this.makeRequest(method, endpoint, data, attempt + 1);
      }
      throw error;
    }
  }

  // Sincronizar usuários
  public async syncUsuarios(): Promise<void> {
    try {
      if (!this.isOnline) {
        console.log("Offline - pulando sincronização de usuários");
        return;
      }

      const response = await this.makeRequest("GET", "/usuarios");

      // Só sobrescrever se o servidor retornar dados válidos
      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        await this.persistenceService.saveUsuarios(response.data);
        console.log("Usuários sincronizados com sucesso");
      } else {
        console.log("Servidor retornou dados vazios - mantendo dados locais");
      }
    } catch (error: any) {
      // Não logar erros de rede para evitar spam
      if (error.message !== "Servidor offline") {
        console.error("Erro ao sincronizar usuários:", error);
      }
      // Não re-throw para não interromper o fluxo
    }
  }

  // Sincronizar projetos
  public async syncProjetos(): Promise<void> {
    try {
      if (!this.isOnline) {
        console.log("Offline - pulando sincronização de projetos");
        return;
      }

      const response = await this.makeRequest("GET", "/projetos");
      await this.persistenceService.saveProjetos(response.data);
      console.log("Projetos sincronizados com sucesso");
    } catch (error: any) {
      if (error.message !== "Servidor offline") {
        console.error("Erro ao sincronizar projetos:", error);
      }
    }
  }

  // Sincronizar campos
  public async syncCampos(): Promise<void> {
    try {
      if (!this.isOnline) {
        console.log("Offline - pulando sincronização de campos");
        return;
      }

      const response = await this.makeRequest("GET", "/campos");
      await this.persistenceService.saveCampos(response.data);
      console.log("Campos sincronizados com sucesso");
    } catch (error: any) {
      if (error.message !== "Servidor offline") {
        console.error("Erro ao sincronizar campos:", error);
      }
    }
  }

  // Sincronizar coletas
  public async syncColetas(): Promise<void> {
    try {
      if (!this.isOnline) {
        console.log("Offline - pulando sincronização de coletas");
        return;
      }

      const response = await this.makeRequest("GET", "/coletas");
      await this.persistenceService.saveColetas(response.data);
      console.log("Coletas sincronizadas com sucesso");
    } catch (error: any) {
      if (error.message !== "Servidor offline") {
        console.error("Erro ao sincronizar coletas:", error);
      }
    }
  }

  // Sincronizar famílias
  public async syncFamilias(): Promise<void> {
    try {
      if (!this.isOnline) {
        console.log("Offline - pulando sincronização de famílias");
        return;
      }

      const response = await this.makeRequest("GET", "/familias");
      await this.persistenceService.saveFamilias(response.data);
      console.log("Famílias sincronizadas com sucesso");
    } catch (error: any) {
      if (error.message !== "Servidor offline") {
        console.error("Erro ao sincronizar famílias:", error);
      }
    }
  }

  // Sincronizar gêneros
  public async syncGeneros(): Promise<void> {
    try {
      if (!this.isOnline) {
        console.log("Offline - pulando sincronização de gêneros");
        return;
      }

      const response = await this.makeRequest("GET", "/generos");
      await this.persistenceService.saveGeneros(response.data);
      console.log("Gêneros sincronizados com sucesso");
    } catch (error: any) {
      if (error.message !== "Servidor offline") {
        console.error("Erro ao sincronizar gêneros:", error);
      }
    }
  }

  // Sincronizar espécies
  public async syncEspecies(): Promise<void> {
    try {
      if (!this.isOnline) {
        console.log("Offline - pulando sincronização de espécies");
        return;
      }

      const response = await this.makeRequest("GET", "/especies");
      await this.persistenceService.saveEspecies(response.data);
      console.log("Espécies sincronizadas com sucesso");
    } catch (error: any) {
      if (error.message !== "Servidor offline") {
        console.error("Erro ao sincronizar espécies:", error);
      }
    }
  }

  // Sincronização completa
  public async syncAll(): Promise<void> {
    try {
      console.log("Iniciando sincronização completa...");

      await this.checkConnectivity();

      if (!this.isOnline) {
        console.log(
          "Dispositivo offline - sincronização será feita quando houver conexão"
        );
        return;
      }

      // Executar sincronizações em paralelo, mas capturar erros individuais
      const syncPromises = [
        this.syncUsuarios().catch(() => {}),
        this.syncProjetos().catch(() => {}),
        this.syncCampos().catch(() => {}),
        this.syncColetas().catch(() => {}),
        this.syncFamilias().catch(() => {}),
        this.syncGeneros().catch(() => {}),
        this.syncEspecies().catch(() => {}),
      ];

      await Promise.all(syncPromises);

      await this.persistenceService.saveLastSync(new Date().toISOString());
      console.log("Sincronização completa realizada com sucesso");
    } catch (error: any) {
      // Não logar erros de rede para evitar spam
      if (error.message !== "Servidor offline") {
        console.error("Erro na sincronização completa:", error);
      }
      // Não re-throw para não interromper o fluxo
    }
  }

  // Enviar dados pendentes
  public async sendPendingData(): Promise<void> {
    try {
      if (!this.isOnline) {
        console.log(
          "Offline - dados pendentes serão enviados quando houver conexão"
        );
        return;
      }

      // Aqui você implementaria a lógica para enviar dados que foram criados offline
      // Por exemplo, coletas criadas sem conexão
      console.log("Enviando dados pendentes...");

      // Implementar lógica específica para cada tipo de dado pendente
    } catch (error) {
      console.error("Erro ao enviar dados pendentes:", error);
      throw error;
    }
  }

  // Verificar se há dados pendentes
  public async hasPendingData(): Promise<boolean> {
    try {
      // Implementar verificação de dados pendentes
      return false;
    } catch (error) {
      console.error("Erro ao verificar dados pendentes:", error);
      return false;
    }
  }

  // Obter status da sincronização
  public async getSyncStatus(): Promise<{
    lastSync: string | null;
    isOnline: boolean;
    hasPendingData: boolean;
  }> {
    try {
      const lastSync = await this.persistenceService.getLastSync();
      const hasPendingData = await this.hasPendingData();

      return {
        lastSync,
        isOnline: this.isOnline,
        hasPendingData,
      };
    } catch (error) {
      console.error("Erro ao obter status da sincronização:", error);
      return {
        lastSync: null,
        isOnline: false,
        hasPendingData: false,
      };
    }
  }
}

export default SyncService;
