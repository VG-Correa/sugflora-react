import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import HeaderInterno from "../components/HeaderInterno";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColetaData } from "../data/coletas/ColetaDataContext";
import { useProjetoData } from "../data/projetos/ProjetoDataContext";
import { useCampoData } from "../data/campos/CampoDataContext";

const MyCollectionsScreen = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;
  const isMobile = screenWidth < 768;
  const [coletas, setColetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProjects, setExpandedProjects] = useState({});
  const [expandedFields, setExpandedFields] = useState({});

  // Usando os contextos
  const { coletas: todasColetas } = useColetaData();
  const { projetos } = useProjetoData();
  const { campos } = useCampoData();

  const tableColumnSizes = isMobile
    ? { id: 80, nome: 200, campo: 150, data: 120, status: 100, acoes: 100 }
    : { id: 100, nome: 250, campo: 200, data: 150, status: 120, acoes: 120 };

  const formatDate = (dateString) => {
    try {
      if (!dateString || dateString === undefined || dateString === null) {
        return "Não definida";
      }

      // Se já é uma string formatada (dd/mm/yyyy), retorna como está
      if (typeof dateString === "string" && dateString.includes("/")) {
        return dateString;
      }

      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Data inválida";
      }

      return date.toLocaleDateString("pt-BR");
    } catch (e) {
      console.error("Erro ao formatar data:", e, "Valor recebido:", dateString);
      return "Data inválida";
    }
  };

  const toggleProject = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const toggleField = (fieldId) => {
    setExpandedFields(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId]
    }));
  };

  const organizeColetasByProjectAndField = (coletas) => {
    const organized = {};

    coletas.forEach(coleta => {
      // Buscar campo primeiro
      const campo = campos.find(c => c.id === coleta.campo_id);
      
      // Buscar projeto através do campo
      const projeto = campo ? projetos.find(p => p.id === campo.projeto_id) : null;

      const projetoId = projeto?.id || 'sem_projeto';
      const projetoNome = projeto?.nome || 'Sem Projeto';
      const campoId = campo?.id || 'sem_campo';
      const campoNome = campo?.nome || 'Sem Campo';

      if (!organized[projetoId]) {
        organized[projetoId] = {
          id: projetoId,
          nome: projetoNome,
          campos: {}
        };
      }

      if (!organized[projetoId].campos[campoId]) {
        organized[projetoId].campos[campoId] = {
          id: campoId,
          nome: campoNome,
          coletas: []
        };
      }

      organized[projetoId].campos[campoId].coletas.push({
        ...coleta,
        projeto_id: projeto?.id, // Adicionar projeto_id para navegação
        dataFormatada: formatDate(coleta.data_coleta),
        status: coleta.identificada ? "Identificada" : "Não identificada",
        statusColor: coleta.identificada ? "#4caf50" : "#ff9800",
      });
    });

    return organized;
  };

  async function fetchColetas() {
    try {
      setLoading(true);
      setError(null);

      // Verificar token e user_id
      const token = await AsyncStorage.getItem("token");
      const user_id = await AsyncStorage.getItem("user_id");

      if (!token) {
        throw new Error("Token não encontrado. Faça login novamente.");
      }

      if (!user_id) {
        throw new Error("Usuário não identificado");
      }

      console.log("=== DEBUG DADOS ===");
      console.log("Projetos disponíveis:", projetos);
      console.log("Campos disponíveis:", campos);
      console.log("Coletas disponíveis:", todasColetas);

      // Usar as coletas do contexto
      if (todasColetas && todasColetas.length > 0) {
        console.log("Coletas encontradas:", todasColetas.length);

        // Filtrar apenas coletas ativas (não deletadas)
        const coletasAtivas = todasColetas.filter((coleta) => !coleta.deleted);
        console.log("Coletas ativas:", coletasAtivas.length);

        // Organizar coletas por projeto e campo
        const coletasOrganizadas = organizeColetasByProjectAndField(coletasAtivas);
        console.log("Coletas organizadas:", coletasOrganizadas);
        setColetas(coletasOrganizadas);
      } else {
        console.log("Nenhuma coleta encontrada");
        setColetas({});
      }
    } catch (error) {
      console.error("Erro ao buscar coletas:", error);
      setError(error.message || "Erro ao carregar coletas");
      Alert.alert(
        "Erro",
        "Não foi possível carregar as coletas. Por favor, tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchColetas();
  }, [todasColetas, projetos, campos]);

  const handleAddCollection = () => {
    navigation.navigate("SelectProjectAndField");
  };

  const handleGenerateReport = () => {
    navigation.navigate("MyReports");
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleColetaPress = (coleta) => {
    navigation.navigate("ColetaScreen", {
      coleta: coleta,
      campo: { id: coleta.campo_id },
      projeto: { id: coleta.projeto_id },
    });
  };

  const renderColetaItem = (coleta) => (
    <TouchableOpacity
      key={coleta.id}
      style={styles.coletaItem}
      onPress={() => handleColetaPress(coleta)}
      activeOpacity={0.7}
    >
      <View style={styles.coletaInfo}>
        <Text style={styles.coletaNome}>{coleta.nome}</Text>
        <Text style={styles.coletaData}>{coleta.dataFormatada}</Text>
      </View>
      <View style={styles.coletaStatus}>
        <View style={[styles.statusBadge, { backgroundColor: coleta.statusColor }]}>
          <Text style={styles.statusText}>{coleta.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFieldSection = (projetoId, campo) => {
    const isExpanded = expandedFields[campo.id];
    
    return (
      <View key={campo.id} style={styles.fieldSection}>
        <TouchableOpacity
          style={styles.fieldHeader}
          onPress={() => toggleField(campo.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
          <Text style={styles.fieldName}>{campo.nome}</Text>
          <Text style={styles.coletaCount}>({campo.coletas.length} coletas)</Text>
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.coletasList}>
            {campo.coletas.map(renderColetaItem)}
          </View>
        )}
      </View>
    );
  };

  const renderProjectSection = (projeto) => {
    const isExpanded = expandedProjects[projeto.id];
    const totalColetas = Object.values(projeto.campos).reduce(
      (total, campo) => total + campo.coletas.length, 0
    );
    
    return (
      <View key={projeto.id} style={styles.projectSection}>
        <TouchableOpacity
          style={styles.projectHeader}
          onPress={() => toggleProject(projeto.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
          <Text style={styles.projectName}>{projeto.nome}</Text>
          <Text style={styles.coletaCount}>({totalColetas} coletas)</Text>
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.fieldsList}>
            {Object.values(projeto.campos).map(campo => 
              renderFieldSection(projeto.id, campo)
            )}
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <HeaderInterno />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2e7d32" />
          <Text style={styles.loadingText}>Carregando coletas...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <HeaderInterno />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchColetas}>
            <Text style={styles.buttonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const projetosArray = Object.values(coletas);

  return (
    <View style={styles.container}>
      <HeaderInterno />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.pageTitle}>MINHAS COLETAS</Text>

        {projetosArray.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhuma coleta encontrada</Text>
            <Text style={styles.emptySubtext}>
              Clique em "ADICIONAR COLETA" para começar
            </Text>
          </View>
        ) : (
          <View style={styles.hierarchicalList}>
            {projetosArray.map(renderProjectSection)}
          </View>
        )}
      </ScrollView>

      {/* Action buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.addButton]}
          onPress={handleAddCollection}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>ADICIONAR COLETA</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.reportButton]}
          onPress={handleGenerateReport}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>GERAR RELATÓRIO</Text>
        </TouchableOpacity>

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
    backgroundColor: "#fff" 
  },
  content: { 
    flex: 1 
  },
  scrollContent: { 
    padding: 15, 
    paddingBottom: 100 
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 20,
    textAlign: "center",
  },
  hierarchicalList: {
    marginBottom: 20,
  },
  projectSection: {
    marginBottom: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  projectHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#2e7d32",
  },
  projectName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    marginLeft: 10,
  },
  expandIcon: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  coletaCount: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
  },
  fieldsList: {
    padding: 10,
  },
  fieldSection: {
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  fieldHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#e8f5e9",
  },
  fieldName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2e7d32",
    flex: 1,
    marginLeft: 10,
  },
  coletasList: {
    padding: 10,
  },
  coletaItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  coletaInfo: {
    flex: 1,
  },
  coletaNome: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  coletaData: {
    fontSize: 14,
    color: "#666",
  },
  coletaStatus: {
    marginLeft: 10,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
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
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 5,
    minWidth: 110,
    maxWidth: 150,
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    flexBasis: "30%",
    marginVertical: 5,
  },
  addButton: { 
    backgroundColor: "#2e7d32" 
  },
  reportButton: { 
    backgroundColor: "#1565c0" 
  },
  backButton: { 
    backgroundColor: "#999" 
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  emptySubtext: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#d32f2f",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
});

export default MyCollectionsScreen;
