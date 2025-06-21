import React, { ReactNode, useEffect } from "react";
import { UsuarioDataProvider } from "./usuarios/UsuarioDataContext";
import { ProjetoDataProvider } from "./projetos/ProjetoDataContext";
import { CampoDataProvider } from "./campos/CampoDataContext";
import { ColetaDataProvider } from "./coletas/ColetaDataContext";
import { FamiliaDataProvider } from "./familias/FamiliaDataContext";
import { GeneroDataProvider } from "./generos/GeneroDataContext";
import { EspecieDataProvider } from "./especies/EspecieDataContext";
import { NotificacaoDataProvider } from "./notificacoes/NotificacaoDataContext";
import { RelatorioDataProvider } from "./relatorios/RelatorioDataContext";
import { SugestaoIdentificacaoDataProvider } from "./sugestoes/SugestaoIdentificacaoContext";
import PersistenceService from "./services/PersistenceService";
import CacheService from "./services/CacheService";
import SyncService from "./services/SyncService";
import { useNetworkStatus } from "./hooks/useNetworkStatus";
import AppConfig from "./config/AppConfig";

interface AppDataProviderProps {
  children: ReactNode;
}

// Configurações dos serviços
const configureServices = () => {
  // Configurar serviço de sincronização
  const syncService = SyncService.getInstance();
  syncService.configure({
    baseURL: AppConfig.api.baseURL,
    timeout: AppConfig.api.timeout,
    retryAttempts: AppConfig.api.retryAttempts,
    retryDelay: AppConfig.api.retryDelay,
  });

  // Configurar serviço de cache
  const cacheService = CacheService.getInstance();
  cacheService.configure({
    defaultTTL: AppConfig.cache.defaultTTL,
    maxSize: AppConfig.cache.maxSize,
    cleanupInterval: AppConfig.cache.cleanupInterval,
  });

  if (AppConfig.development.enableDebugLogs) {
    console.log("Serviços configurados com sucesso");
  }
};

// Componente para inicialização dos serviços
const ServiceInitializer: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { performSync } = useNetworkStatus();

  useEffect(() => {
    // Configurar serviços na inicialização
    configureServices();

    // Realizar sincronização inicial apenas se habilitado
    if (AppConfig.sync.syncOnRestore) {
      const initializeData = async () => {
        try {
          if (AppConfig.development.enableDebugLogs) {
            console.log("Inicializando dados da aplicação...");
          }
          await performSync();
        } catch (error) {
          if (AppConfig.development.enableDebugLogs) {
            console.error("Erro na inicialização dos dados:", error);
          }
        }
      };

      initializeData();
    }
  }, []);

  return <>{children}</>;
};

export const AppDataProvider: React.FC<AppDataProviderProps> = ({
  children,
}) => {
  return (
    <ServiceInitializer>
      <UsuarioDataProvider>
        <ProjetoDataProvider>
          <CampoDataProvider>
            <ColetaDataProvider>
              <FamiliaDataProvider>
                <GeneroDataProvider>
                  <EspecieDataProvider>
                    <NotificacaoDataProvider>
                      <RelatorioDataProvider>
                        <SugestaoIdentificacaoDataProvider>
                          {children}
                        </SugestaoIdentificacaoDataProvider>
                      </RelatorioDataProvider>
                    </NotificacaoDataProvider>
                  </EspecieDataProvider>
                </GeneroDataProvider>
              </FamiliaDataProvider>
            </ColetaDataProvider>
          </CampoDataProvider>
        </ProjetoDataProvider>
      </UsuarioDataProvider>
    </ServiceInitializer>
  );
};

// Hook para acessar todos os serviços
export const useAppServices = () => {
  return {
    persistence: PersistenceService.getInstance(),
    cache: CacheService.getInstance(),
    sync: SyncService.getInstance(),
  };
};

// Hook para limpar todos os dados (útil para logout)
export const useAppDataCleanup = () => {
  const { persistence, cache } = useAppServices();

  const clearAllData = async () => {
    try {
      // Limpar cache
      cache.clear();

      // Limpar persistência
      await persistence.clearAllData();

      console.log("Todos os dados foram limpos com sucesso");
    } catch (error) {
      console.error("Erro ao limpar dados:", error);
      throw error;
    }
  };

  return { clearAllData };
};

export default AppDataProvider;
