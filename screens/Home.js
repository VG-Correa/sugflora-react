import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  SafeAreaView,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import HeaderInterno from "../components/HeaderInterno";
import NetworkStatusBar from "../components/NetworkStatusBar";
import { useNetworkStatus } from "../data/hooks/useNetworkStatus";
import { useAppServices } from "../data/AppDataProvider";
import { useProjetoData } from "../data/projetos/ProjetoDataContext";
import { useCampoData } from "../data/campos/CampoDataContext";
import { useColetaData } from "../data/coletas/ColetaDataContext";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const { width: screenWidth } = useWindowDimensions();
  const isLargeScreen = screenWidth > 768;
  const { networkStatus, performSync } = useNetworkStatus();
  const { persistence, cache } = useAppServices();

  // Contextos de dados
  const { projetos, loading: projetosLoading } = useProjetoData();
  const { campos, loading: camposLoading } = useCampoData();
  const { coletas, loading: coletasLoading } = useColetaData();

  const cardWidth =
    screenWidth > 768 ? "30%" : screenWidth > 480 ? "45%" : "90%";

  useEffect(() => {
    initializeHome();
  }, []);

  const initializeHome = async () => {
    try {
      setLoading(true);
      setError(null);

      // Verificar status da rede e sincronizar se necessário
      if (networkStatus.isConnected && networkStatus.isInternetReachable) {
        console.log("Dispositivo online - verificando sincronização...");
        await performSync();
      } else {
        console.log("Dispositivo offline - usando dados locais");
      }

      // Aguardar carregamento dos contextos
      await Promise.all([
        new Promise((resolve) => {
          if (!projetosLoading) resolve();
          // Implementar listener para quando projetos carregarem
        }),
        new Promise((resolve) => {
          if (!camposLoading) resolve();
          // Implementar listener para quando campos carregarem
        }),
        new Promise((resolve) => {
          if (!coletasLoading) resolve();
          // Implementar listener para quando coletas carregarem
        }),
      ]);
    } catch (err) {
      console.error("Erro ao inicializar Home:", err);
      setError(err.message || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSync = async () => {
    try {
      setLoading(true);
      await performSync();
      Alert.alert("Sucesso", "Sincronização realizada com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Falha na sincronização. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const getStorageInfo = async () => {
    try {
      const info = await persistence.getStorageInfo();
      const usedMB = (info.used / (1024 * 1024)).toFixed(2);
      const totalMB = (info.total / (1024 * 1024)).toFixed(2);
      const percentage = ((info.used / info.total) * 100).toFixed(1);

      Alert.alert(
        "Informações de Armazenamento",
        `Usado: ${usedMB}MB / ${totalMB}MB (${percentage}%)`
      );
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível obter informações de armazenamento"
      );
    }
  };

  const getCacheStats = () => {
    const stats = cache.getStats();
    Alert.alert(
      "Estatísticas do Cache",
      `Itens: ${stats.size}/${stats.maxSize}\n` +
        `Taxa de acerto: ${(stats.hitRate * 100).toFixed(1)}%\n` +
        `Taxa de erro: ${(stats.missRate * 100).toFixed(1)}%`
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <HeaderInterno />
        <NetworkStatusBar onSyncPress={handleManualSync} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2e7d32" />
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <HeaderInterno />
        <NetworkStatusBar onSyncPress={handleManualSync} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={initializeHome}>
            <Text style={styles.buttonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header fixo no topo com logo e navegação */}
        <Header navigation={navigation} />

        <Image
          source={require("../assets/images/forest.webp")}
          style={[styles.heroImage, { height: isLargeScreen ? 350 : 220 }]}
        />

        <View
          style={[
            styles.contentWrapper,
            { flexDirection: isLargeScreen ? "row" : "column" },
          ]}
        >
          {/* Seção Esquerda (Texto + Botão) */}
          <View style={[styles.left, { flex: 1 }]}>
            <Text style={styles.title}>Sistema Único de Gestão</Text>
            <Text style={styles.description}>
              O SUG-FLORA é um sistema de gestão para profissionais que lidam
              com plantas e flores, automatizando tarefas e integrando bancos de
              dados públicos. Além de facilitar o trabalho, oferece uma
              plataforma confiável para pesquisa, identificação de espécies e
              análise de dados.
            </Text>

            {/* Botão fixo na base */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
          </View>

          {/* Seção Direita (Imagens) */}
          <View style={[styles.right, { flex: isLargeScreen ? 1 : undefined }]}>
            <Image
              source={require("../assets/images/forest1.webp")}
              style={styles.smallImage}
            />
            <Image
              source={require("../assets/images/forest2.webp")}
              style={styles.smallImage}
            />
            <Image
              source={require("../assets/images/forest2.webp")}
              style={styles.smallImage}
            />
          </View>
        </View>

        {/* Status da Rede */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusTitle}>Status do Sistema</Text>
          <View style={styles.statusGrid}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Rede</Text>
              <Text
                style={[
                  styles.statusValue,
                  { color: networkStatus.isConnected ? "#4caf50" : "#f44336" },
                ]}
              >
                {networkStatus.isConnected ? "Online" : "Offline"}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Projetos</Text>
              <Text style={styles.statusValue}>{projetos?.length || 0}</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Campos</Text>
              <Text style={styles.statusValue}>{campos?.length || 0}</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Coletas</Text>
              <Text style={styles.statusValue}>{coletas?.length || 0}</Text>
            </View>
          </View>
        </View>

        {/* Menu Principal */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Menu Principal</Text>
          <View style={styles.menuGrid}>
            <TouchableOpacity
              style={[styles.menuItem, { width: cardWidth }]}
              onPress={() => navigation.navigate("MyProjects")}
            >
              <Text style={styles.menuItemText}>Meus Projetos</Text>
              <Text style={styles.menuItemSubtext}>
                {projetos?.length || 0} projeto(s)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, { width: cardWidth }]}
              onPress={() => navigation.navigate("MyCollection")}
            >
              <Text style={styles.menuItemText}>Minha Coleção</Text>
              <Text style={styles.menuItemSubtext}>
                {coletas?.length || 0} coleta(s)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, { width: cardWidth }]}
              onPress={() => navigation.navigate("SearchSpecies")}
            >
              <Text style={styles.menuItemText}>Buscar Espécies</Text>
              <Text style={styles.menuItemSubtext}>Catálogo completo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, { width: cardWidth }]}
              onPress={() => navigation.navigate("MyReports")}
            >
              <Text style={styles.menuItemText}>Meus Relatórios</Text>
              <Text style={styles.menuItemSubtext}>Relatórios gerados</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Ações Rápidas */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.quickActionsTitle}>Ações Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate("NewProject")}
            >
              <Text style={styles.quickActionText}>+ Novo Projeto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate("SelectProjectAndField")}
            >
              <Text style={styles.quickActionText}>+ Nova Coleta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={handleManualSync}
            >
              <Text style={styles.quickActionText}>🔄 Sincronizar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={getStorageInfo}
            >
              <Text style={styles.quickActionText}>💾 Armazenamento</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={getCacheStats}
            >
              <Text style={styles.quickActionText}>📊 Cache</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingBottom: 30,
  },
  heroImage: {
    width: "100%",
    resizeMode: "cover",
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 20,
    gap: 20,
  },
  left: {
    flex: 1,
    justifyContent: "space-between",
    paddingRight: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "left",
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "justify",
  },
  loginButton: {
    backgroundColor: "#648C47",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignSelf: "center",
    marginTop: "auto",
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
  },
  right: {
    flex: 1,
    justifyContent: "center",
    gap: 10,
  },

  smallImage: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
    borderRadius: 10,
  },
  statusContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  statusGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusItem: {
    alignItems: "center",
    flex: 1,
  },
  statusLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  menuContainer: {
    marginBottom: 20,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  menuItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 4,
  },
  menuItemSubtext: {
    fontSize: 12,
    color: "#666",
  },
  quickActionsContainer: {
    marginBottom: 20,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionButton: {
    backgroundColor: "#e8f5e8",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    minWidth: "48%",
    alignItems: "center",
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2e7d32",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#f44336",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#2e7d32",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default Home;
