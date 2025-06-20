import React, { useState, useEffect } from "react";
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
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import HeaderInterno from "../components/HeaderInterno";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useProjetoData } from "../data/projetos/ProjetoDataContext";
import { useCampoData } from "../data/campos/CampoDataContext";

const ProjectScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { projeto } = route.params;
  const [loading, setLoading] = useState(false);
  const { getProjetoById } = useProjetoData();
  const { getCamposByProjetoId } = useCampoData();
  const [projetoAtual, setProjetoAtual] = useState(projeto);
  const [campos, setCampos] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      carregarProjeto();
    }, [])
  );

  const carregarProjeto = async () => {
    try {
      setLoading(true);
      const response = getProjetoById(projeto.id);
      if (response.status === 200 && response.data) {
        setProjetoAtual(response.data);
      } else {
        throw new Error("Erro ao carregar projeto");
      }

      // Carregar campos do projeto
      const camposResponse = getCamposByProjetoId(projeto.id);
      if (camposResponse.status === 200 && camposResponse.data) {
        setCampos(camposResponse.data);
      }
    } catch (error) {
      console.error("Erro ao carregar projeto:", error);
      Alert.alert(
        "Erro",
        "Não foi possível carregar os detalhes do projeto. Por favor, tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

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

  const handleEditProject = () => {
    navigation.navigate("EditProject", { projeto: projetoAtual });
  };

  const handleNewField = () => {
    navigation.navigate("NewField", { projeto: projetoAtual });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <HeaderInterno />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2e7d32" />
          <Text style={styles.loadingText}>Carregando projeto...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderInterno />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{projetoAtual.nome}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProject}
          >
            <Text style={styles.editButtonText}>Editar Projeto</Text>
          </TouchableOpacity>
        </View>

        {projetoAtual.imagemBase64 && (
          <Image
            source={{ uri: projetoAtual.imagemBase64 }}
            style={styles.projectImage}
          />
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Descrição:</Text>
          <Text style={styles.value}>{projetoAtual.descricao || "-"}</Text>

          <Text style={styles.label}>Data de Início:</Text>
          <Text style={styles.value}>{formatDate(projetoAtual.inicio)}</Text>

          {projetoAtual.termino && (
            <>
              <Text style={styles.label}>Data de Término:</Text>
              <Text style={styles.value}>
                {formatDate(projetoAtual.termino)}
              </Text>
            </>
          )}

          {projetoAtual.previsaoConclusao && (
            <>
              <Text style={styles.label}>Previsão de Conclusão:</Text>
              <Text style={styles.value}>
                {formatDate(projetoAtual.previsaoConclusao)}
              </Text>
            </>
          )}
        </View>

        {/* Seção de Campos */}
        <View style={styles.camposContainer}>
          <Text style={styles.camposTitle}>Campos do Projeto</Text>
          {campos.length === 0 ? (
            <Text style={styles.semCampos}>Nenhum campo cadastrado ainda.</Text>
          ) : (
            campos.map((campo) => (
              <View key={campo.id} style={styles.campoItem}>
                <View style={styles.campoHeader}>
                  <Text style={styles.campoNome}>{campo.nome}</Text>
                  <TouchableOpacity
                    style={styles.campoButton}
                    onPress={() =>
                      navigation.navigate("FieldScreen", { campo })
                    }
                  >
                    <Text style={styles.campoButtonText}>Ver</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.campoDescricao}>
                  {campo.descricao || "Sem descrição"}
                </Text>
                <Text style={styles.campoLocalizacao}>
                  📍 {campo.endereco}, {campo.cidade} - {campo.estado},{" "}
                  {campo.pais}
                </Text>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity
          style={styles.newFieldButton}
          onPress={handleNewField}
        >
          <Text style={styles.newFieldButtonText}>+ Novo Campo</Text>
        </TouchableOpacity>
      </ScrollView>
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
  scrollContentContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e7d32",
    flex: 1,
  },
  editButton: {
    backgroundColor: "#2e7d32",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  projectImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  newFieldButton: {
    backgroundColor: "#2e7d32",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  newFieldButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
  camposContainer: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  camposTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 10,
  },
  semCampos: {
    color: "#666",
    fontSize: 16,
    fontStyle: "italic",
  },
  campoItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  campoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  campoNome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  campoButton: {
    backgroundColor: "#2e7d32",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  campoButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  campoDescricao: {
    color: "#666",
    fontSize: 14,
    marginBottom: 5,
  },
  campoLocalizacao: {
    color: "#666",
    fontSize: 14,
  },
});

export default ProjectScreen;
