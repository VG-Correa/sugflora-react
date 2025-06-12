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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import HeaderInterno from "../components/HeaderInterno";
import CampoApi from "../functions/api/CampoApi";

const MyCollectionsScreen = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;
  const isMobile = screenWidth < 768;
  const [campos, setCampos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tableColumnSizes = isMobile
    ? { id: 210, family: 270, genus: 230, species: 270, date: 250, field: 250 }
    : { id: 230, family: 300, genus: 270, species: 330, date: 270, field: 300 };

  async function fetchCampos() {
    try {
      setLoading(true);
      setError(null);
      const user_id = localStorage.getItem("user_id");

      if (!user_id) {
        throw new Error("Usuário não autenticado");
      }

      const response = await CampoApi.getAllByUsuarioId(user_id);

      if (response.status === 200) {
        const todosCampos = response.data.data || [];
        // Filtra apenas os campos ativos
        const camposAtivos = todosCampos.filter((campo) => !campo.deleted);
        setCampos(camposAtivos);
      } else {
        throw new Error("Erro ao carregar campos");
      }
    } catch (err) {
      console.error("Erro:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCampos();
  }, []);

  const handleAddCollection = () => {
    navigation.navigate("AddCollection");
  };

  const handleGenerateReport = () => {
    console.log("Gerar relatório");
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
          <Text style={styles.loadingText}>Carregando campos...</Text>
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
          <TouchableOpacity style={styles.retryButton} onPress={fetchCampos}>
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
        <Text style={styles.pageTitle}>MEUS CAMPOS</Text>

        {/* Tabela de Campos */}
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
                  { width: tableColumnSizes.family },
                ]}
              >
                NOME
              </Text>
              <Text
                style={[
                  styles.tableHeaderText,
                  { width: tableColumnSizes.genus },
                ]}
              >
                PROJETO
              </Text>
              <Text
                style={[
                  styles.tableHeaderText,
                  { width: tableColumnSizes.species },
                ]}
              >
                DATA INÍCIO
              </Text>
              <Text
                style={[
                  styles.tableHeaderText,
                  { width: tableColumnSizes.date },
                ]}
              >
                STATUS
              </Text>
              <Text
                style={[
                  styles.tableHeaderText,
                  { width: tableColumnSizes.field },
                ]}
              >
                AÇÕES
              </Text>
            </View>

            {campos.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhum campo encontrado</Text>
              </View>
            ) : (
              campos.map((campo) => (
                <View key={campo.id} style={styles.tableRow}>
                  <Text
                    style={[styles.tableCell, { width: tableColumnSizes.id }]}
                  >
                    {campo.id}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      { width: tableColumnSizes.family },
                    ]}
                  >
                    {campo.nome}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      { width: tableColumnSizes.genus },
                    ]}
                  >
                    {campo.projeto?.nome || "Não definido"}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      { width: tableColumnSizes.species },
                    ]}
                  >
                    {campo.data_inicio
                      ? (() => {
                          try {
                            if (campo.data_inicio.includes("T")) {
                              const data = new Date(campo.data_inicio);
                              return data.toLocaleDateString("pt-BR");
                            } else if (campo.data_inicio.includes("-")) {
                              const [ano, mes, dia] =
                                campo.data_inicio.split("-");
                              return `${dia}/${mes}/${ano}`;
                            }
                            return "Data inválida";
                          } catch (error) {
                            return "Data inválida";
                          }
                        })()
                      : "Não definida"}
                  </Text>
                  <Text
                    style={[styles.tableCell, { width: tableColumnSizes.date }]}
                  >
                    {campo.deleted ? "Inativo" : "Ativo"}
                  </Text>
                  <View
                    style={[
                      styles.tableCell,
                      { width: tableColumnSizes.field },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() =>
                        navigation.navigate("FieldScreen", { campo })
                      }
                    >
                      <Text style={styles.actionButtonText}>Abrir</Text>
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
    fontSize: 16,
    color: "#666",
  },
  actionButton: {
    backgroundColor: "#2e7d32",
    paddingVertical: 6,
    paddingHorizontal: 12,
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
