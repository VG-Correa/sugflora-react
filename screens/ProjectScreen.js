import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import CampoApi from "../functions/api/CampoApi";
import ColetaApi from "../functions/api/ColetaApi";
import HeaderInterno from "../components/HeaderInterno";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useProjetoData } from "../data/projetos/ProjetoDataContext";

const ProjectScreen = () => {
  const navigation = useNavigation();
  const { currentProjeto } = useProjetoData();

  const [campos, setCampos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateInput) => {
    if (!dateInput) return "Não definida";
    try {
      let date;
      if (Array.isArray(dateInput)) {
        const [ano, mes, dia] = dateInput;
        date = new Date(ano, mes - 1, dia);
      } else {
        date = new Date(String(dateInput).replace(" ", "T"));
      }

      if (isNaN(date.getTime())) return "Data inválida";

      const dia = String(date.getDate()).padStart(2, "0");
      const mes = String(date.getMonth() + 1).padStart(2, "0");
      const ano = date.getFullYear();
      return `${dia}/${mes}/${ano}`;
    } catch (error) {
      return "Data inválida";
    }
  };

  async function fetchCampos() {
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

      // Buscar todos os campos do usuário
      const response = await CampoApi.getAllByUsuarioId(user_id);
      console.log(
        "Resposta completa da API de campos:",
        JSON.stringify(response, null, 2)
      );

      if (response.status === 200 && response.data && response.data.data) {
        console.log(
          "Dados brutos dos campos:",
          JSON.stringify(response.data.data, null, 2)
        );

        // Filtrar apenas campos não deletados
        const camposAtivos = response.data.data
          .filter((campo) => campo !== null)
          .filter((campo) => !campo.deleted);

        console.log(
          "Campos ativos encontrados:",
          JSON.stringify(camposAtivos, null, 2)
        );

        // Buscar informações de coletas para cada campo
        const camposComColetas = await Promise.all(
          camposAtivos.map(async (campo) => {
            try {
              const coletasResponse = await ColetaApi.getColetasByCampoId(
                campo.id
              );
              console.log(
                `Coletas do campo ${campo.id}:`,
                coletasResponse.data
              );

              const coletas = coletasResponse.data.data || [];

              // Contar coletas identificadas e não identificadas
              const identificadas = coletas.filter(
                (coleta) => coleta && coleta.identificada
              ).length;
              const naoIdentificadas = coletas.filter(
                (coleta) => coleta && !coleta.identificada
              ).length;

              return {
                ...campo,
                totalColetas: coletas.length,
                identificadas,
                naoIdentificadas,
                projetoNome: campo.projeto?.nome || "Sem projeto",
                dataInicio: formatDate(campo.data_inicio),
                dataTermino: campo.data_termino
                  ? formatDate(campo.data_termino)
                  : "Não definida",
                endereco: `${campo.endereco}, ${campo.cidade} - ${campo.estado}, ${campo.pais}`,
              };
            } catch (error) {
              console.error(
                `Erro ao buscar coletas do campo ${campo.id}:`,
                error
              );
              return {
                ...campo,
                totalColetas: 0,
                identificadas: 0,
                naoIdentificadas: 0,
                projetoNome: campo.projeto?.nome || "Sem projeto",
                dataInicio: formatDate(campo.data_inicio),
                dataTermino: campo.data_termino
                  ? formatDate(campo.data_termino)
                  : "Não definida",
                endereco: `${campo.endereco}, ${campo.cidade} - ${campo.estado}, ${campo.pais}`,
              };
            }
          })
        );

        console.log(
          "Campos com coletas:",
          JSON.stringify(camposComColetas, null, 2)
        );
        setCampos(camposComColetas);
      } else {
        console.error("Resposta inválida da API:", response);
        throw new Error("Erro ao carregar campos");
      }
    } catch (error) {
      console.error("Erro ao buscar campos:", error);
      setError(error.message || "Erro ao carregar campos");
      Alert.alert(
        "Erro",
        "Não foi possível carregar os campos. Por favor, tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCampos();
  }, []);

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
      <HeaderInterno />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.pageTitle}>
          PROJETO - {projeto.nome.toUpperCase()}
        </Text>

        {/* Bloco de Informações do Projeto */}
        <View style={styles.infoContainer}>
          <View style={styles.detailsContainer}>
            <View style={styles.topRow}>
              <View style={styles.infoColumn}>
                <Text style={styles.infoLabel}>DATA DE INÍCIO</Text>
                <View style={styles.infoBox}>
                  <Text style={styles.infoValue}>
                    {currentProjeto.dataInicio}
                  </Text>
                </View>
              </View>
              <View style={styles.infoColumn}>
                <Text style={styles.infoLabel}>PREVISÃO DE CONCLUSÃO</Text>
                <View style={styles.infoBox}>
                  <Text style={styles.infoValue}>
                    {currentProjeto.dataFim}
                  </Text>
                </View>
              </View>
              <View style={styles.infoColumn}>
                <Text style={styles.infoLabel}>STATUS</Text>
                <View
                  style={[
                    styles.infoBox,
                    { paddingVertical: 0, paddingHorizontal: 0 },
                  ]}
                >
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>Ativo</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.fullWidthRow}>
              <Text style={styles.infoLabel}>DESCRIÇÃO</Text>
              <View style={styles.infoBox}>
                <Text style={styles.infoValue}>{currentProjeto.descricao}</Text>
              </View>
            </View>
            <View style={styles.fullWidthRow}>
              <Text style={styles.infoLabel}>RESPONSÁVEL</Text>
              <View style={styles.infoBox}>
                <Text style={styles.infoValue}>{currentProjeto.responsavel.nome}</Text>
              </View>
            </View>
          </View>
          <View style={styles.projectImageContainer}>
            {console.log(currentProjeto)}
            <Image
              source={require("../assets/images/sem-imagem.webp")}
              style={styles.projectImage}
            />
          </View>
        </View>

        {/* Bloco da Tabela de Campos */}
        <View style={styles.tableContainer}>
          <Text style={styles.sectionTitle}>CAMPOS</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 3 }]}>NOME</Text>
            <Text
              style={[
                styles.tableHeaderText,
                { flex: 1.5, textAlign: "center" },
              ]}
            >
              COLETAS
            </Text>
            <Text
              style={[styles.tableHeaderText, { flex: 2, textAlign: "center" }]}
            >
              IDENTIFICADAS
            </Text>
            <Text
              style={[
                styles.tableHeaderText,
                { flex: 2.5, textAlign: "center" },
              ]}
            >
              NÃO IDENTIFICADAS
            </Text>
            <Text
              style={[
                styles.tableHeaderText,
                { flex: 1.5, textAlign: "center" },
              ]}
            >
              STATUS
            </Text>
          </View>
          {campos.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum campo encontrado</Text>
            </View>
          ) : (
            campos.map((campo, index) => (
              <View key={campo.id} style={styles.tableRow}>
                <TouchableOpacity
                  style={[styles.tableCell, { flex: 3 }]}
                  onPress={() =>
                    navigation.navigate("FieldScreen", { campo: campo })
                  }
                >
                  <Text style={styles.linkText}>{campo.nome}</Text>
                  <Text style={styles.projectName}>
                    Projeto: {campo.projetoNome}
                  </Text>
                  <Text style={styles.fieldInfo}>
                    Início: {campo.dataInicio}
                  </Text>
                  <Text style={styles.fieldInfo}>
                    Término: {campo.dataTermino}
                  </Text>
                  <Text style={styles.fieldInfo} numberOfLines={1}>
                    {campo.endereco}
                  </Text>
                </TouchableOpacity>

                <Text
                  style={[styles.tableCell, { flex: 1.5, textAlign: "center" }]}
                >
                  {campo.totalColetas}
                </Text>
                <Text
                  style={[styles.tableCell, { flex: 2, textAlign: "center" }]}
                >
                  {campo.identificadas}
                </Text>
                <Text
                  style={[styles.tableCell, { flex: 2.5, textAlign: "center" }]}
                >
                  {campo.naoIdentificadas}
                </Text>

                <View
                  style={[
                    styles.tableCell,
                    { flex: 1.5, alignItems: "center" },
                  ]}
                >
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>
                      {campo.deleted ? "Inativo" : "Ativo"}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Botões de Ação */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.addButton]}
            onPress={() =>
              navigation.navigate("NewField", { projeto: projeto })
            }
          >
            <Text style={styles.buttonText}>Adicionar Campos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() =>
              navigation.navigate("EditProject", { projeto: projeto })
            }
          >
            <Text style={styles.buttonText}>Editar Projeto</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F8F4" },
  content: { flex: 1 },
  scrollContent: { padding: 25 },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 20,
    textAlign: "left",
  },
  infoContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    marginBottom: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  detailsContainer: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  infoColumn: {
    flex: 1,
    marginRight: 15,
  },
  fullWidthRow: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 12,
    color: "#555",
    marginBottom: 5,
    fontWeight: "bold",
  },
  infoBox: {
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
  },
  statusBadge: {
    backgroundColor: "#2e7d32",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  projectImageContainer: {
    marginLeft: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  projectImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  tableContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    marginBottom: 25,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 10,
    marginBottom: 5,
  },
  tableHeaderText: {
    fontWeight: "bold",
    color: "#555",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  tableCell: {
    color: "#333",
  },
  linkText: {
    color: "#2e7d32",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#2e7d32",
  },
  editButton: {
    backgroundColor: "#5a9bd5",
  },
  buttonText: {
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
  retryButton: {
    backgroundColor: "#d32f2f",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
  },
  projectName: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  fieldInfo: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
});

export default ProjectScreen;
