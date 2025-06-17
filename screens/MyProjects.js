import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import projetoApi from "../functions/api/projetoApi";
import HeaderInterno from "../components/HeaderInterno";
import { useProjetoData } from "../data/projetos/ProjetoDataContext";
const coresAbas = ["#b2d8b2", "#ccc", "#f8a5a5"];

const MyProjects = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const {projetos, deleteProjeto, setCurrentProjeto} = useProjetoData();

  console.log("Projetos carregados:", projetos);
  
  const cardWidth = width > 768 ? "30%" : width > 480 ? "45%" : "90%";

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "Não definida";

      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Data inválida";

      return date.toLocaleDateString("pt-BR");
    } catch (e) {
      console.error("Erro ao formatar data:", e);
      return "Data inválida";
    }
  };

  const handleDeleteProject = (projetoId) => {
    console.log("Botão de exclusão clicado para o projeto:", projetoId);

    try {
      Alert.alert(
        "Confirmar exclusão",
        "Tem certeza que deseja excluir este projeto?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Excluir",
            style: "destructive",
            onPress: async () => {
              try {
                setLoading(true);
                console.log("Iniciando exclusão do projeto ID:", projetoId);

                const response = deleteProjeto(projetoId);
                if (response.status === 200) {
                  console.log("Projeto excluído com sucesso!");
                  // Atualizar a lista de projetos
                  await fetchProjetos();
                  Alert.alert("Sucesso", "Projeto excluído com sucesso!");
                } else {
                  throw new Error(
                    response.data?.message ||
                      response.data?.error ||
                      "Erro ao excluir projeto"
                  );
                }
              } catch (error) {
                console.error("Erro ao excluir projeto:", {
                  message: error.message,
                  response: error.response?.data,
                  status: error.response?.status,
                });

                Alert.alert(
                  "Erro",
                  error.response?.data?.message ||
                    error.message ||
                    "Não foi possível excluir o projeto. Tente novamente."
                );
              } finally {
                setLoading(false);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Erro ao iniciar exclusão:", error);
      Alert.alert("Erro", "Não foi possível iniciar a exclusão do projeto");
    }
  };

  const handleViewProject = (projeto) => {
    setCurrentProjeto(projeto);
    navigation.navigate("ProjectScreen");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <HeaderInterno />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2e7d32" />
          <Text style={styles.loadingText}>Carregando projetos...</Text>
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
          <TouchableOpacity style={styles.retryButton} onPress={fetchProjetos}>
            <Text style={styles.buttonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderInterno />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.pageTitle}>MEUS PROJETOS</Text>
          <TouchableOpacity
            style={styles.newProjectButton}
            onPress={() => navigation.navigate("NewProject")}
          >
            <Text style={styles.newProjectButtonText}>+ Novo Projeto</Text>
          </TouchableOpacity>
        </View>
        {projetos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Você ainda não tem projetos</Text>
            <TouchableOpacity
              style={styles.createFirstButton}
              onPress={() => navigation.navigate("NewProject")}
            >
              <Text style={styles.createFirstButtonText}>
                Criar primeiro projeto
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.projectsGrid, { width: "100%" }]}>
            {projetos.map((projeto) => {
              console.log("Renderizando projeto:", projeto);
              // const corAba = coresAbas[index % coresAbas.length];
              return (
                <View
                  key={projeto.id}
                  style={[styles.projectCard, { width: cardWidth }]} 
                >
                  <View style={[styles.folderTab, { backgroundColor: 'white' }]}>
                    <Text style={styles.projectTitle} numberOfLines={1}>
                      {projeto.nome}
                    </Text>
                    {projeto.image && (
                      <Image
                        source={{
                          uri: `${projetoApi.baseUrl}/${projeto.id}/imagem`,
                        }}
                        style={styles.projectImage}
                      />
                    )}
                  </View>

                  <View style={styles.projectBody}>
                    <Text style={styles.label}>Descrição:</Text>
                    <Text style={styles.value} numberOfLines={2}>
                      {projeto.descricao || "-"}
                    </Text>

                    <Text style={styles.label}>Data de Início:</Text>
                    <Text style={styles.value}>
                      {formatDate(projeto.inicio)}
                    </Text>

                    {projeto.previsaoConclusao && (
                      <>
                        <Text style={styles.label}>Previsão de Conclusão:</Text>
                        <Text style={styles.value}>
                          {formatDate(projeto.previsaoConclusao)}
                        </Text>
                      </>
                    )}

                    {projeto.responsavel && (
                      <>
                        <Text style={styles.label}>Responsável:</Text>
                        <Text style={styles.value}>{projeto.responsavel.nome}</Text>
                      </>
                    )} 

                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          { backgroundColor: "green" },
                        ]}
                        onPress={() => handleViewProject(projeto)}
                      >
                        <Text style={styles.buttonText}>Ver projeto</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => {
                          console.log("Botão de exclusão clicado");
                          handleDeleteProject(projeto.id);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.buttonText}>Excluir</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  newProjectButton: {
    backgroundColor: "#2e7d32",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  newProjectButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  projectsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },
  projectCard: {
    borderRadius: 8,
    backgroundColor: "#f4f4f4",
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  folderTab: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
    marginRight: 10,
  },
  projectImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  projectBody: {
    backgroundColor: "#dcedc8",
    padding: 15,
  },
  label: {
    fontSize: 12,
    color: "#555",
    fontWeight: "bold",
    marginTop: 5,
  },
  value: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
  },
  deleteButton: {
    backgroundColor: "#d32f2f",
    marginLeft: 10,
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  createFirstButton: {
    backgroundColor: "#2e7d32",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  createFirstButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default MyProjects;
