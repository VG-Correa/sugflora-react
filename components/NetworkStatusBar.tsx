import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNetworkStatus } from "../data/hooks/useNetworkStatus";

interface NetworkStatusBarProps {
  showSyncButton?: boolean;
  onSyncPress?: () => void;
}

const NetworkStatusBar: React.FC<NetworkStatusBarProps> = ({
  showSyncButton = true,
  onSyncPress,
}) => {
  const { networkStatus, syncStatus, performSync } = useNetworkStatus();

  const getStatusColor = () => {
    if (!networkStatus.isConnected) return "#f44336"; // Vermelho
    if (!networkStatus.isInternetReachable) return "#ff9800"; // Laranja
    return "#4caf50"; // Verde
  };

  const getStatusText = () => {
    if (!networkStatus.isConnected) return "Offline";
    if (!networkStatus.isInternetReachable) return "Sem Internet";
    return "Online";
  };

  const getConnectionTypeText = () => {
    if (networkStatus.isWifi) return "Wi-Fi";
    if (networkStatus.isCellular) return "Dados Móveis";
    if (networkStatus.isEthernet) return "Ethernet";
    return "Desconhecido";
  };

  const formatLastSync = (timestamp: string | null) => {
    if (!timestamp) return "Nunca";

    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );

      if (diffInMinutes < 1) return "Agora mesmo";
      if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h atrás`;

      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d atrás`;
    } catch (error) {
      return "Desconhecido";
    }
  };

  const handleSyncPress = async () => {
    if (onSyncPress) {
      onSyncPress();
    } else {
      await performSync();
    }
  };

  if (networkStatus.isConnected && networkStatus.isInternetReachable) {
    // Se está online, mostrar apenas um indicador discreto
    return (
      <View style={[styles.container, styles.onlineContainer]}>
        <View
          style={[styles.statusDot, { backgroundColor: getStatusColor() }]}
        />
        <Text style={styles.statusText}>
          {getConnectionTypeText()} • Sinc:{" "}
          {formatLastSync(syncStatus.lastSync)}
        </Text>
        {syncStatus.hasPendingData && (
          <View style={styles.pendingIndicator}>
            <Text style={styles.pendingText}>!</Text>
          </View>
        )}
        {showSyncButton && (
          <TouchableOpacity
            style={styles.syncButton}
            onPress={handleSyncPress}
            disabled={syncStatus.hasPendingData}
          >
            <Text style={styles.syncButtonText}>Sinc</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Se está offline, mostrar barra mais proeminente
  return (
    <View style={[styles.container, styles.offlineContainer]}>
      <View style={styles.offlineContent}>
        <View
          style={[styles.statusDot, { backgroundColor: getStatusColor() }]}
        />
        <Text style={styles.offlineText}>
          {getStatusText()} • Última sincronização:{" "}
          {formatLastSync(syncStatus.lastSync)}
        </Text>
        {showSyncButton && (
          <TouchableOpacity
            style={[styles.syncButton, styles.offlineSyncButton]}
            onPress={handleSyncPress}
          >
            <Text style={styles.syncButtonText}>Tentar Sincronizar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  onlineContainer: {
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(76, 175, 80, 0.3)",
  },
  offlineContainer: {
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(244, 67, 54, 0.3)",
  },
  offlineContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: "#666",
    flex: 1,
  },
  offlineText: {
    fontSize: 14,
    color: "#d32f2f",
    fontWeight: "500",
    flex: 1,
  },
  pendingIndicator: {
    backgroundColor: "#ff9800",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  pendingText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  syncButton: {
    backgroundColor: "#2196f3",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  offlineSyncButton: {
    backgroundColor: "#ff9800",
  },
  syncButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
});

export default NetworkStatusBar;
