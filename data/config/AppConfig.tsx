// Configurações da aplicação SugFlora
export const AppConfig = {
  // Configurações de API
  api: {
    baseURL: "http://localhost:8080/api",
    timeout: 5000, // Reduzindo timeout para 5 segundos
    retryAttempts: 2, // Reduzindo tentativas para 2
    retryDelay: 1000, // 1 segundo entre tentativas
  },

  // Configurações de cache
  cache: {
    defaultTTL: 5 * 60 * 1000, // 5 minutos
    maxSize: 100, // Reduzindo tamanho máximo
    cleanupInterval: 10 * 60 * 1000, // 10 minutos
  },

  // Configurações de sincronização
  sync: {
    checkInterval: 60000, // Verificar status a cada 1 minuto
    syncOnRestore: true, // Sincronizar quando conexão for restaurada
    minSyncInterval: 60000, // Intervalo mínimo entre sincronizações (1 minuto)
  },

  // Configurações de rede
  network: {
    connectivityCheckTimeout: 3000, // 3 segundos para verificar conectividade
    enableRetry: true,
    logNetworkErrors: false, // Desabilitar logs de erro de rede
  },

  // Configurações de desenvolvimento
  development: {
    enableDebugLogs: false, // Desabilitar logs de debug
    mockServer: false, // Usar servidor mock
  },

  // Configurações de persistência
  PERSISTENCE: {
    KEYS: {
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
      USER_PREFERENCES: "sugflora_user_preferences",
      OFFLINE_DATA: "sugflora_offline_data",
    },
    MAX_STORAGE_SIZE: 6 * 1024 * 1024, // 6MB
  },

  // Configurações de UI
  UI: {
    REFRESH_INTERVAL: 30 * 1000, // 30 segundos
    LOADING_TIMEOUT: 10 * 1000, // 10 segundos
    ERROR_DISPLAY_TIME: 5000, // 5 segundos
    ANIMATION_DURATION: 300, // 300ms
  },

  // Configurações de validação
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 6,
    MAX_NAME_LENGTH: 100,
    MAX_DESCRIPTION_LENGTH: 500,
    ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  },

  // Configurações de notificações
  NOTIFICATIONS: {
    SYNC_SUCCESS: true,
    SYNC_ERROR: true,
    OFFLINE_MODE: true,
    DATA_UPDATES: true,
    PUSH_ENABLED: true,
  },

  // Configurações de debug
  DEBUG: {
    ENABLED: __DEV__,
    LOG_LEVEL: "info", // 'error', 'warn', 'info', 'debug'
    SHOW_NETWORK_STATUS: true,
    SHOW_CACHE_STATS: false,
    SHOW_SYNC_STATUS: true,
  },

  // Configurações de ambiente
  ENVIRONMENT: {
    IS_DEVELOPMENT: __DEV__,
    IS_PRODUCTION: !__DEV__,
    VERSION: "1.0.0",
    BUILD_NUMBER: "1",
  },
};

// Tipos para as configurações
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface CacheConfig {
  defaultTTL: number;
  maxSize: number;
  cleanupInterval: number;
}

export interface SyncConfig {
  checkInterval: number;
  syncOnRestore: boolean;
  minSyncInterval: number;
}

export interface NetworkConfig {
  connectivityCheckTimeout: number;
  enableRetry: boolean;
  logNetworkErrors: boolean;
}

// Função para obter configuração específica do ambiente
export const getConfig = (
  environment: "development" | "production" | "test"
) => {
  switch (environment) {
    case "development":
      return {
        ...AppConfig,
        development: {
          ...AppConfig.development,
          enableDebugLogs: true,
        },
      };
    case "production":
      return {
        ...AppConfig,
        api: {
          ...AppConfig.api,
          baseURL: "https://api.sugflora.com/api", // URL de produção
          timeout: 10000,
          retryAttempts: 3,
        },
        development: {
          ...AppConfig.development,
          enableDebugLogs: false,
        },
      };
    case "test":
      return {
        ...AppConfig,
        api: {
          ...AppConfig.api,
          baseURL: "http://localhost:3000/api", // URL de teste
        },
      };
    default:
      return AppConfig;
  }
};

// Função para validar configurações
export const validateConfig = (): boolean => {
  try {
    const config = getConfig("development");

    // Validar URL da API
    if (!config.api.baseURL) {
      console.error("URL da API não configurada");
      return false;
    }

    // Validar timeouts
    if (config.api.timeout <= 0) {
      console.error("Timeout da API deve ser maior que 0");
      return false;
    }

    // Validar configurações de cache
    if (config.cache.maxSize <= 0) {
      console.error("Tamanho máximo do cache deve ser maior que 0");
      return false;
    }

    console.log("Configurações validadas com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao validar configurações:", error);
    return false;
  }
};

export default AppConfig;
