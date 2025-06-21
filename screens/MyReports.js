import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import HeaderInterno from "../components/HeaderInterno";
import { useRelatorioData } from "../data/relatorios/RelatorioDataContext";
import { useProjetoData } from "../data/projetos/ProjetoDataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MyReports = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;
  const isMobile = screenWidth < 768;

  const [loading, setLoading] = useState(true);
  const [user_id, setUser_id] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [userProjetos, setUserProjetos] = useState([]);

  // Usando os contextos
  const { relatorios, loading: relatoriosLoading, refreshRelatorios } = useRelatorioData();
  const { projetos, getProjetosByUsuarioDono } = useProjetoData();

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    // Debug: Log quando projetos mudam
    console.log("=== PROJETOS MUDARAM ===");
    console.log("projetos.length:", projetos.length);
    console.log("projetos:", projetos);
  }, [projetos]);

  // Recarregar projetos quando a tela receber foco
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (user_id) {
        loadUserProjetos(user_id);
      }
    });

    return unsubscribe;
  }, [navigation, user_id]);

  const loadUserData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("user_id");
      if (!storedUserId) {
        Alert.alert("Erro", "Usuário não identificado");
        navigation.goBack();
        return;
      }
      setUser_id(storedUserId);
      
      // Carregar projetos do usuário
      await loadUserProjetos(storedUserId);
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      Alert.alert("Erro", "Erro ao carregar dados do usuário");
    } finally {
      setLoading(false);
    }
  };

  const loadUserProjetos = async (userId) => {
    try {
      console.log("Buscando projetos para o usuário:", Number(userId));
      console.log("Tipo do user_id:", typeof Number(userId));
      
      const response = getProjetosByUsuarioDono(Number(userId));
      console.log("Resposta da API:", response);
      console.log("Status da resposta:", response.status);
      console.log("Dados da resposta:", response.data);
      
      if (response.status === 200 && response.data) {
        console.log("Projetos encontrados:", response.data);
        console.log("Quantidade de projetos:", response.data.length);
        setUserProjetos(response.data);
      } else {
        console.log("Nenhum projeto encontrado ou erro na resposta");
        setUserProjetos([]);
      }
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
      setUserProjetos([]);
    }
  };

  const handleGenerateBiodiversityReport = () => {
    if (!selectedProject) {
      Alert.alert(
        "Projeto Necessário",
        "Por favor, selecione um projeto para gerar o relatório de biodiversidade."
      );
      return;
    }

    navigation.navigate("BiodiversityReport", {
      projeto: selectedProject,
      tipo: "biodiversidade"
    });
  };

  const handleGenerateQuantitativeReport = () => {
    if (!selectedProject) {
      Alert.alert(
        "Projeto Necessário",
        "Por favor, selecione um projeto para gerar o relatório quantitativo."
      );
      return;
    }

    navigation.navigate("QuantitativeReport", {
      projeto: selectedProject,
      tipo: "quantitativo"
    });
  };

  const handleGenerateQualitativeReport = () => {
    if (!selectedProject) {
      Alert.alert(
        "Projeto Necessário",
        "Por favor, selecione um projeto para gerar o relatório qualitativo."
      );
      return;
    }

    navigation.navigate("QualitativeReport", {
      projeto: selectedProject,
      tipo: "qualitativo"
    });
  };

  const handleViewReport = (relatorio) => {
    navigation.navigate("ReportView", {
      relatorio: relatorio,
      modo: "visualizacao"
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "Não definida";
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR");
    } catch (e) {
      return "Data inválida";
    }
  };

  const getReportTypeLabel = (tipo) => {
    switch (tipo) {
      case "biodiversidade":
        return "Biodiversidade";
      case "quantitativo":
        return "Quantitativo";
      case "qualitativo":
        return "Qualitativo";
      default:
        return tipo;
    }
  };

  const getReportStatusColor = (status) => {
    switch (status) {
      case "concluido":
        return "#4caf50";
      case "processando":
        return "#ff9800";
      case "erro":
        return "#f44336";
      default:
        return "#999";
    }
  };

  if (loading || relatoriosLoading) {
    return (
      <View style={styles.container}>
        <HeaderInterno />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2e7d32" />
          <Text style={styles.loadingText}>Carregando relatórios...</Text>
        </View>
      </View>
    );
  }

  // Debug: Log dos dados para verificar
  console.log("=== DEBUG MYREPORTS ===");
  console.log("user_id:", user_id, "tipo:", typeof user_id);
  console.log("userProjetos carregados:", userProjetos.length);
  console.log("userProjetos:", userProjetos.map(p => ({ id: p.id, nome: p.nome, usuario_dono_id: p.usuario_dono_id })));
  console.log("todos os relatórios:", relatorios);
  console.log("relatórios disponíveis:", relatorios.length);

  const userRelatorios = relatorios.filter(r => String(r.usuario_id) === String(user_id) && !r.deleted);

  console.log("userRelatorios encontrados:", userRelatorios.length);
  console.log("userRelatorios:", userRelatorios);

  return (
    <View style={styles.container}>
      <HeaderInterno />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.pageTitle}>MEUS RELATÓRIOS</Text>

        {/* Seção de Geração de Relatórios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gerar Novo Relatório</Text>
          
          {/* Seleção de Projeto */}
          <View style={styles.projectSelection}>
            <Text style={styles.subsectionTitle}>Selecione um Projeto:</Text>
            
            {userProjetos.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Você não possui projetos cadastrados
                </Text>
                <Text style={styles.debugText}>
                  Debug: user_id = {user_id}, projetos carregados = {userProjetos.length}
                </Text>
                <TouchableOpacity 
                  style={styles.createProjectButton}
                  onPress={() => navigation.navigate("NewProject")}
                >
                  <Text style={styles.createProjectButtonText}>Criar Novo Projeto</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.testButton}
                  onPress={() => {
                    console.log("=== TESTE MANUAL ===");
                    console.log("user_id:", user_id);
                    console.log("userProjetos:", userProjetos);
                    console.log("todos os projetos:", projetos);
                    Alert.alert("Debug", `user_id: ${user_id}\nProjetos carregados: ${userProjetos.length}\nTotal projetos: ${projetos.length}`);
                  }}
                >
                  <Text style={styles.testButtonText}>Teste Debug</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.projectScroll}
              >
                {userProjetos.map((projeto) => (
                  <TouchableOpacity
                    key={projeto.id}
                    style={[
                      styles.projectCard,
                      selectedProject?.id === projeto.id && styles.projectCardSelected
                    ]}
                    onPress={() => setSelectedProject(projeto)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.projectName,
                      selectedProject?.id === projeto.id && styles.projectNameSelected
                    ]}>
                      {projeto.nome}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Botões de Geração */}
          {selectedProject && (
            <View style={styles.reportButtons}>
              <TouchableOpacity
                style={[styles.reportButton, styles.biodiversityButton]}
                onPress={handleGenerateBiodiversityReport}
                activeOpacity={0.7}
              >
                <Text style={styles.reportButtonText}>Relatório de Biodiversidade</Text>
                <Text style={styles.reportButtonSubtext}>
                  Análise completa da diversidade biológica
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.reportButton, styles.quantitativeButton]}
                onPress={handleGenerateQuantitativeReport}
                activeOpacity={0.7}
              >
                <Text style={styles.reportButtonText}>Relatório Quantitativo</Text>
                <Text style={styles.reportButtonSubtext}>
                  Estatísticas e números das coletas
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.reportButton, styles.qualitativeButton]}
                onPress={handleGenerateQualitativeReport}
                activeOpacity={0.7}
              >
                <Text style={styles.reportButtonText}>Relatório Qualitativo</Text>
                <Text style={styles.reportButtonSubtext}>
                  Análise descritiva e observações
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Lista de Relatórios Existentes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Relatórios Gerados</Text>
          
          {/* Botões de debug */}
          <View style={styles.debugButtons}>
            <TouchableOpacity 
              style={styles.testButton}
              onPress={() => {
                console.log("=== TESTE RELATÓRIOS ===");
                console.log("user_id:", user_id);
                console.log("todos os relatórios:", relatorios);
                console.log("relatórios disponíveis:", relatorios.length);
                console.log("userRelatorios filtrados:", userRelatorios);
                Alert.alert("Debug Relatórios", 
                  `user_id: ${user_id}\n` +
                  `Total relatórios: ${relatorios.length}\n` +
                  `Relatórios do usuário: ${userRelatorios.length}\n` +
                  `Relatórios: ${JSON.stringify(userRelatorios.map(r => ({ id: r.id, titulo: r.titulo, usuario_id: r.usuario_id })), null, 2)}`
                );
              }}
            >
              <Text style={styles.testButtonText}>Teste Relatórios</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={async () => {
                console.log("=== REFRESH RELATÓRIOS ===");
                await refreshRelatorios();
                Alert.alert("Refresh", "Relatórios recarregados!");
              }}
            >
              <Text style={styles.refreshButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
          
          {userRelatorios.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum relatório encontrado</Text>
              <Text style={styles.emptySubtext}>
                Gere seu primeiro relatório selecionando um projeto acima
              </Text>
            </View>
          ) : (
            <View style={styles.reportsList}>
              {userRelatorios.map((relatorio) => (
                <TouchableOpacity
                  key={relatorio.id}
                  style={styles.reportItem}
                  onPress={() => handleViewReport(relatorio)}
                  activeOpacity={0.7}
                >
                  <View style={styles.reportHeader}>
                    <Text style={styles.reportTitle}>{relatorio.titulo}</Text>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getReportStatusColor(relatorio.status) }
                    ]}>
                      <Text style={styles.statusText}>
                        {relatorio.status || "Pendente"}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.reportDetails}>
                    <Text style={styles.reportType}>
                      Tipo: {getReportTypeLabel(relatorio.tipo)}
                    </Text>
                    <Text style={styles.reportDate}>
                      Gerado em: {formatDate(relatorio.created_at)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Botões de Ação */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>VOLTAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 100,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 15,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  projectSelection: {
    marginBottom: 20,
  },
  projectScroll: {
    marginBottom: 15,
  },
  projectCard: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    minWidth: 150,
    borderWidth: 2,
    borderColor: "transparent",
  },
  projectCardSelected: {
    backgroundColor: "#e8f5e9",
    borderColor: "#2e7d32",
  },
  projectName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  projectNameSelected: {
    color: "#2e7d32",
  },
  reportButtons: {
    gap: 15,
  },
  reportButton: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#e9ecef",
  },
  biodiversityButton: {
    borderColor: "#28a745",
    backgroundColor: "#d4edda",
  },
  quantitativeButton: {
    borderColor: "#007bff",
    backgroundColor: "#d1ecf1",
  },
  qualitativeButton: {
    borderColor: "#6f42c1",
    backgroundColor: "#e2d9f3",
  },
  reportButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  reportButtonSubtext: {
    fontSize: 14,
    color: "#666",
  },
  reportsList: {
    gap: 15,
  },
  reportItem: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  reportDetails: {
    gap: 5,
  },
  reportType: {
    fontSize: 14,
    color: "#666",
  },
  reportDate: {
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#666",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  createProjectButton: {
    backgroundColor: "#2e7d32",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
  createProjectButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  debugText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 10,
  },
  testButton: {
    backgroundColor: "#666",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
  testButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 15,
    color: "#2e7d32",
    fontSize: 16,
  },
  debugButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  refreshButton: {
    backgroundColor: "#2e7d32",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  refreshButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default MyReports;
