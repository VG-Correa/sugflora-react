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

const MyCollectionsScreen = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;
  const isMobile = screenWidth < 768;
  const [coletas, setColetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usando o contexto de coletas
  const { coletas: todasColetas } = useColetaData();

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

      // Usar as coletas do contexto
      if (todasColetas && todasColetas.length > 0) {
        console.log("Coletas encontradas:", todasColetas.length);

        // Filtrar apenas coletas ativas (não deletadas)
        const coletasAtivas = todasColetas.filter((coleta) => !coleta.deleted);

        // Formatar as coletas para exibição
        const coletasFormatadas = coletasAtivas.map((coleta) => ({
          ...coleta,
          dataFormatada: formatDate(coleta.data_coleta),
          status: coleta.identificada ? "Identificada" : "Não identificada",
          statusColor: coleta.identificada ? "#4caf50" : "#ff9800",
        }));

        setColetas(coletasFormatadas);
      } else {
        console.log("Nenhuma coleta encontrada");
        setColetas([]);
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
  }, [todasColetas]);

  const handleAddCollection = () => {
    navigation.navigate("SelectProjectAndField");
  };

  const handleGenerateReport = () => {
    navigation.navigate("ReportConfiguration");
  };

  const handleBack = () => {
    navigation.goBack();
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <HeaderInterno />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.pageTitle}>MINHAS COLETAS</Text>

        {/* Tabela de Coletas */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tableScrollContainer}
        >
          <View>
            <View style={styles.tableHeader}>
              <Text
                style={[styles.tableHeaderText, { width: tableColumnSizes.id }]}
              >
                ID
              </Text>
              <Text
                style={[
                  styles.tableHeaderText,
                  { width: tableColumnSizes.nome },
                ]}
              >
                NOME
              </Text>
              <Text
                style={[
                  styles.tableHeaderText,
                  { width: tableColumnSizes.campo },
                ]}
              >
                CAMPO
              </Text>
              <Text
                style={[
                  styles.tableHeaderText,
                  { width: tableColumnSizes.data },
                ]}
              >
                DATA
              </Text>
              <Text
                style={[
                  styles.tableHeaderText,
                  { width: tableColumnSizes.status },
                ]}
              >
                STATUS
              </Text>
              <Text
                style={[
                  styles.tableHeaderText,
                  { width: tableColumnSizes.acoes },
                ]}
              >
                AÇÕES
              </Text>
            </View>

            {coletas.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhuma coleta encontrada</Text>
              </View>
            ) : (
              coletas.map((coleta) => (
                <View key={coleta.id} style={styles.tableRow}>
                  <Text
                    style={[styles.tableCell, { width: tableColumnSizes.id }]}
                  >
                    {coleta.id}
                  </Text>
                  <Text
                    style={[styles.tableCell, { width: tableColumnSizes.nome }]}
                  >
                    {coleta.nome}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      { width: tableColumnSizes.campo },
                    ]}
                  >
                    {coleta.campo_id || "Não definido"}
                  </Text>
                  <Text
                    style={[styles.tableCell, { width: tableColumnSizes.data }]}
                  >
                    {coleta.dataFormatada}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        width: tableColumnSizes.status,
                        color: coleta.statusColor,
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    {coleta.status}
                  </Text>
                  <View
                    style={[
                      styles.tableCell,
                      { width: tableColumnSizes.acoes },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() =>
                        navigation.navigate("ColetaScreen", {
                          coleta: coleta,
                          campo: { id: coleta.campo_id },
                          projeto: null,
                        })
                      }
                    >
                      <Text style={styles.actionButtonText}>Ver</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
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
  container: { flex: 1, backgroundColor: "#fff" },
  headerContainer: { height: 220, width: "100%", position: "relative" },
  headerBackgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  headerContent: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
    paddingTop: 40,
  },
  logoImage: { width: 80, height: 80 },
  logoText: { fontSize: 24, fontWeight: "bold", color: "#fff", marginTop: 10 },
  menuTop: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  menuText: { color: "#fff", fontWeight: "bold", fontSize: 12 },

  content: { flex: 1 },
  scrollContent: { padding: 15, paddingBottom: 100 },

  pageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 15,
    textAlign: "left",
  },

  tableScrollContainer: { minWidth: "100%" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e8f5e9",
    paddingVertical: 14,
    paddingHorizontal: 35,
  },
  tableHeaderText: {
    fontWeight: "bold",
    textAlign: "left",
    fontSize: 14,
    color: "#2e7d32",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tableCell: {
    textAlign: "left",
    fontSize: 14,
    color: "#333",
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
  addButton: { backgroundColor: "#2e7d32" },
  reportButton: { backgroundColor: "#1565c0" },
  backButton: { backgroundColor: "#999" },
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
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
    fontStyle: "italic",
  },
  actionButton: {
    backgroundColor: "#2e7d32",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  retryButton: {
    backgroundColor: "#d32f2f",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
});

export default MyCollectionsScreen;
