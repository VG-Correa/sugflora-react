import React, { useState, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderInterno from "../components/HeaderInterno";
import DatePicker from "../components/DatePicker";
import CustomPicker from "../components/CustomPicker";
import { useProjetoData } from "../data/projetos/ProjetoDataContext";
import { useColetaData } from "../data/coletas/ColetaDataContext";

const ReportConfiguration = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;
  const isMobile = screenWidth < 768;

  const [loading, setLoading] = useState(false);
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);
  const [projetoSelecionado, setProjetoSelecionado] = useState(null);
  const [tipoRelatorio, setTipoRelatorio] = useState("completo");
  const [userProjetos, setUserProjetos] = useState([]);
  const [user_id, setUser_id] = useState(null);

  // Usando os contextos de dados
  const { projetos, getProjetosByUsuarioDono } = useProjetoData();
  const { coletas } = useColetaData();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("user_id");
        if (!storedUserId) {
          Alert.alert("Erro", "Usuário não identificado");
          navigation.goBack();
          return;
        }
        setUser_id(storedUserId);
        await loadUserProjetos(storedUserId);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        Alert.alert("Erro", "Erro ao carregar dados do usuário");
      }
    };

    loadUserData();
  }, []);

  const loadUserProjetos = async (userId) => {
    try {
      const result = getProjetosByUsuarioDono(userId);
      if (result.status === 200 && result.data) {
        setUserProjetos(result.data);
      } else {
        console.log("Nenhum projeto encontrado para o usuário");
        setUserProjetos([]);
      }
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
      setUserProjetos([]);
    }
  };

  const handleGenerateReport = () => {
    // Validar se há coletas para gerar relatório
    if (!coletas || coletas.length === 0) {
      Alert.alert(
        "Nenhuma Coleta",
        "Você não possui coletas cadastradas para gerar relatório."
      );
      return;
    }

    // Filtrar coletas baseado nos critérios selecionados
    let coletasFiltradas = coletas.filter((coleta) => !coleta.deleted);

    // Filtrar por projeto se selecionado
    if (projetoSelecionado) {
      // Aqui você precisaria ter o campo projeto_id na coleta
      // Por enquanto, vamos filtrar por campo_id que pertence ao projeto
      coletasFiltradas = coletasFiltradas.filter(
        (coleta) =>
          coleta.campo_id &&
          projetoSelecionado.campos?.some(
            (campo) => campo.id === coleta.campo_id
          )
      );
    }

    // Filtrar por período se selecionado
    if (dataInicio) {
      coletasFiltradas = coletasFiltradas.filter((coleta) => {
        const dataColeta = new Date(coleta.data_coleta);
        return dataColeta >= dataInicio;
      });
    }

    if (dataFim) {
      coletasFiltradas = coletasFiltradas.filter((coleta) => {
        const dataColeta = new Date(coleta.data_coleta);
        return dataColeta <= dataFim;
      });
    }

    if (coletasFiltradas.length === 0) {
      Alert.alert(
        "Nenhuma Coleta Encontrada",
        "Não foram encontradas coletas com os filtros selecionados."
      );
      return;
    }

    // Navegar para a tela de visualização do relatório
    navigation.navigate("ReportView", {
      coletas: coletasFiltradas,
      filtros: {
        dataInicio,
        dataFim,
        projeto: projetoSelecionado,
        tipoRelatorio,
      },
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const clearFilters = () => {
    setDataInicio(null);
    setDataFim(null);
    setProjetoSelecionado(null);
    setTipoRelatorio("completo");
  };

  return (
    <View style={styles.container}>
      <HeaderInterno />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <Text style={styles.pageTitle}>CONFIGURAR RELATÓRIO</Text>

        <Text style={styles.description}>
          Configure os filtros para gerar o relatório de suas coletas
        </Text>

        {/* Tipo de Relatório */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de Relatório</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                tipoRelatorio === "completo" && styles.radioButtonSelected,
              ]}
              onPress={() => setTipoRelatorio("completo")}
            >
              <View
                style={[
                  styles.radioCircle,
                  tipoRelatorio === "completo" && styles.radioCircleSelected,
                ]}
              />
              <Text style={styles.radioText}>Relatório Completo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.radioButton,
                tipoRelatorio === "resumido" && styles.radioButtonSelected,
              ]}
              onPress={() => setTipoRelatorio("resumido")}
            >
              <View
                style={[
                  styles.radioCircle,
                  tipoRelatorio === "resumido" && styles.radioCircleSelected,
                ]}
              />
              <Text style={styles.radioText}>Relatório Resumido</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filtro por Período */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Período de Coleta</Text>

          <View style={styles.dateContainer}>
            <View style={styles.dateField}>
              <Text style={styles.dateLabel}>Data Início</Text>
              <DatePicker
                value={dataInicio}
                onChange={setDataInicio}
                placeholder="Selecione a data inicial"
                maximumDate={dataFim}
              />
            </View>

            <View style={styles.dateField}>
              <Text style={styles.dateLabel}>Data Fim</Text>
              <DatePicker
                value={dataFim}
                onChange={setDataFim}
                placeholder="Selecione a data final"
                minimumDate={dataInicio}
              />
            </View>
          </View>
        </View>

        {/* Filtro por Projeto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Filtrar por Projeto</Text>

          {userProjetos.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Você não possui projetos cadastrados
              </Text>
            </View>
          ) : (
            <CustomPicker
              items={[
                { id: null, label: "Todos os projetos" },
                ...userProjetos.map((projeto) => ({
                  id: projeto.id,
                  label: projeto.nome,
                })),
              ]}
              placeholder="Selecione um projeto (opcional)"
              value={projetoSelecionado?.id}
              onChange={(item) => setProjetoSelecionado(item)}
            />
          )}
        </View>

        {/* Resumo dos Filtros */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Resumo dos Filtros</Text>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Tipo:</Text>
            <Text style={styles.summaryValue}>
              {tipoRelatorio === "completo"
                ? "Relatório Completo"
                : "Relatório Resumido"}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Período:</Text>
            <Text style={styles.summaryValue}>
              {dataInicio && dataFim
                ? `${dataInicio.toLocaleDateString(
                    "pt-BR"
                  )} a ${dataFim.toLocaleDateString("pt-BR")}`
                : dataInicio
                ? `A partir de ${dataInicio.toLocaleDateString("pt-BR")}`
                : dataFim
                ? `Até ${dataFim.toLocaleDateString("pt-BR")}`
                : "Todas as datas"}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Projeto:</Text>
            <Text style={styles.summaryValue}>
              {projetoSelecionado
                ? projetoSelecionado.nome
                : "Todos os projetos"}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total de Coletas:</Text>
            <Text style={styles.summaryValue}>
              {coletas ? coletas.filter((c) => !c.deleted).length : 0} coletas
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Botões de Ação */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={clearFilters}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>LIMPAR FILTROS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.generateButton]}
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
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e7d32",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 15,
  },
  radioContainer: {
    gap: 15,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  radioButtonSelected: {
    borderColor: "#2e7d32",
    backgroundColor: "#e8f5e9",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    marginRight: 10,
  },
  radioCircleSelected: {
    borderColor: "#2e7d32",
    backgroundColor: "#2e7d32",
  },
  radioText: {
    fontSize: 16,
    color: "#333",
  },
  dateContainer: {
    gap: 15,
  },
  dateField: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
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
  },
  summaryContainer: {
    backgroundColor: "#e8f5e9",
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 15,
  },
  summaryItem: {
    flexDirection: "row",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
    width: 100,
  },
  summaryValue: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  clearButton: {
    backgroundColor: "#ff9800",
  },
  generateButton: {
    backgroundColor: "#2e7d32",
  },
  backButton: {
    backgroundColor: "#666",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ReportConfiguration;
