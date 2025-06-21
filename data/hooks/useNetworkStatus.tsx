import { useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import SyncService from "../services/SyncService";

interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
  isWifi: boolean;
  isCellular: boolean;
  isEthernet: boolean;
  isUnknown: boolean;
}

interface UseNetworkStatusReturn {
  networkStatus: NetworkStatus;
  syncStatus: {
    lastSync: string | null;
    hasPendingData: boolean;
  };
  performSync: () => Promise<void>;
  checkConnectivity: () => Promise<boolean>;
}

export const useNetworkStatus = (): UseNetworkStatusReturn => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: true,
    type: null,
    isWifi: false,
    isCellular: false,
    isEthernet: false,
    isUnknown: true,
  });

  const [syncStatus, setSyncStatus] = useState<{
    lastSync: string | null;
    hasPendingData: boolean;
  }>({
    lastSync: null,
    hasPendingData: false,
  });

  const [lastSyncAttempt, setLastSyncAttempt] = useState<number>(0);
  const syncService = SyncService.getInstance();

  useEffect(() => {
    // Verificar status inicial
    checkInitialStatus();

    // Configurar listener para mudanças de conectividade
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkStatus({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
        isWifi: state.type === "wifi",
        isCellular: state.type === "cellular",
        isEthernet: state.type === "ethernet",
        isUnknown: state.type === "unknown",
      });

      // Se a conexão foi restaurada, tentar sincronizar (com limite de frequência)
      if (state.isConnected && state.isInternetReachable) {
        const now = Date.now();
        if (now - lastSyncAttempt > 60000) {
          // Só sincronizar se passou mais de 1 minuto
          console.log("Conexão restaurada - tentando sincronizar...");
          setLastSyncAttempt(now);
          performSync();
        }
      }
    });

    // Verificar status da sincronização periodicamente (reduzindo frequência)
    const syncInterval = setInterval(async () => {
      try {
        const status = await syncService.getSyncStatus();
        setSyncStatus({
          lastSync: status.lastSync,
          hasPendingData: status.hasPendingData,
        });
      } catch (error) {
        // Não logar erros de verificação de status para evitar spam
      }
    }, 60000); // Verificar a cada 1 minuto (era 30 segundos)

    return () => {
      unsubscribe();
      clearInterval(syncInterval);
    };
  }, [lastSyncAttempt]);

  const checkInitialStatus = async () => {
    try {
      const state = await NetInfo.fetch();
      setNetworkStatus({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
        isWifi: state.type === "wifi",
        isCellular: state.type === "cellular",
        isEthernet: state.type === "ethernet",
        isUnknown: state.type === "unknown",
      });

      // Verificar status da sincronização
      const status = await syncService.getSyncStatus();
      setSyncStatus({
        lastSync: status.lastSync,
        hasPendingData: status.hasPendingData,
      });
    } catch (error) {
      // Não logar erros de verificação inicial para evitar spam
    }
  };

  const checkConnectivity = async (): Promise<boolean> => {
    try {
      const isConnected = await syncService.checkConnectivity();
      return isConnected;
    } catch (error) {
      return false;
    }
  };

  const performSync = async (): Promise<void> => {
    try {
      if (!networkStatus.isConnected || !networkStatus.isInternetReachable) {
        console.log(
          "Dispositivo offline - sincronização será feita quando houver conexão"
        );
        return;
      }

      console.log("Iniciando sincronização...");
      await syncService.syncAll();

      // Atualizar status da sincronização
      const status = await syncService.getSyncStatus();
      setSyncStatus({
        lastSync: status.lastSync,
        hasPendingData: status.hasPendingData,
      });

      console.log("Sincronização concluída com sucesso");
    } catch (error) {
      // Não logar erros de sincronização para evitar spam
    }
  };

  return {
    networkStatus,
    syncStatus,
    performSync,
    checkConnectivity,
  };
};
