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
import { useProjetoData } from "../data/projetos/ProjetoDataContext";
import { useCampoData } from "../data/campos/CampoDataContext";

const SelectProjectAndField = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;
  const isMobile = screenWidth < 768;

  const [selectedProjeto, setSelectedProjeto] = useState(null);
  const [selectedCampo, setSelectedCampo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProjetos, setUserProjetos] = useState([]);
  const [projetoCampos, setProjetoCampos] = useState([]);
  const [user_id, setUser_id] = useState(null);

  // Usando os contextos de dados
  const { projetos, getProjetosByUsuarioDono } = useProjetoData();
  const { campos, getCamposByProjetoId } = useCampoData();

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
      } finally {
        setLoading(false);
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

  const loadProjetoCampos = async (projetoId) => {
    try {
      const result = getCamposByProjetoId(projetoId);
      if (result.status === 200 && result.data) {
        setProjetoCampos(result.data);
      } else {
        console.log("Nenhum campo encontrado para o projeto");
        setProjetoCampos([]);
      }
    } catch (error) {
      console.error("Erro ao carregar campos:", error);
      setProjetoCampos([]);
    }
  };

  const handleProjetoSelect = (projeto) => {
    setSelectedProjeto(projeto);
    setSelectedCampo(null); // Reset campo selection
    loadProjetoCampos(projeto.id);
  };

  const handleCampoSelect = (campo) => {
    setSelectedCampo(campo);
  };

  const handleContinue = () => {
    if (!selectedProjeto) {
      Alert.alert("Atenção", "Por favor, selecione um projeto");
      return;
    }

    if (!selectedCampo) {
      Alert.alert("Atenção", "Por favor, selecione um campo");
      return;
    }

    // Navegar para a tela de cadastro de coleta com os dados selecionados
    navigation.navigate("AddCollection", {
      projeto: selectedProjeto,
      campo: selectedCampo,
    });
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
          <Text style={styles.loadingText}>Carregando...</Text>
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
        <Text style={styles.pageTitle}>SELECIONAR PROJETO E CAMPO</Text>

        <Text style={styles.description}>
          Selecione o projeto e o campo onde você deseja cadastrar a coleta
        </Text>

        {/* Seção de Projetos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Selecione o Projeto</Text>

          {userProjetos.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Você não possui projetos cadastrados
              </Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate("NewProject")}
              >
                <Text style={styles.createButtonText}>Criar Projeto</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.projectsContainer}
            >
              {userProjetos.map((projeto) => (
                <TouchableOpacity
                  key={projeto.id}
                  style={[
                    styles.projectCard,
                    selectedProjeto?.id === projeto.id && styles.selectedCard,
                  ]}
                  onPress={() => handleProjetoSelect(projeto)}
                >
                  <Text style={styles.projectName}>{projeto.nome}</Text>
                  <Text style={styles.projectDescription}>
                    {projeto.descricao || "Sem descrição"}
                  </Text>
                  <Text style={styles.projectStatus}>
                    Status: {projeto.ativo ? "Ativo" : "Inativo"}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Seção de Campos */}
        {selectedProjeto && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Selecione o Campo</Text>

            {projetoCampos.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  O projeto "{selectedProjeto.nome}" não possui campos
                  cadastrados
                </Text>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={() =>
                    navigation.navigate("NewField", {
                      projeto: selectedProjeto,
                    })
                  }
                >
                  <Text style={styles.createButtonText}>Criar Campo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.fieldsContainer}
              >
                {projetoCampos.map((campo) => (
                  <TouchableOpacity
                    key={campo.id}
                    style={[
                      styles.fieldCard,
                      selectedCampo?.id === campo.id && styles.selectedCard,
                    ]}
                    onPress={() => handleCampoSelect(campo)}
                  >
                    <Text style={styles.fieldName}>{campo.nome}</Text>
                    <Text style={styles.fieldLocation}>
                      Localização: {campo.localizacao || "Não informada"}
                    </Text>
                    <Text style={styles.fieldArea}>
                      Área: {campo.area || "Não informada"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        )}

        {/* Resumo da Seleção */}
        {selectedProjeto && selectedCampo && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Resumo da Seleção</Text>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Projeto:</Text>
              <Text style={styles.summaryValue}>{selectedProjeto.nome}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Campo:</Text>
              <Text style={styles.summaryValue}>{selectedCampo.nome}</Text>
            </View>
          </View>
        )}
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

        <TouchableOpacity
          style={[
            styles.button,
            styles.continueButton,
            (!selectedProjeto || !selectedCampo) && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={!selectedProjeto || !selectedCampo}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>CONTINUAR</Text>
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
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
  projectsContainer: {
    paddingRight: 20,
  },
  fieldsContainer: {
    paddingRight: 20,
  },
  projectCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    minWidth: 200,
    borderWidth: 2,
    borderColor: "transparent",
  },
  fieldCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    minWidth: 200,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedCard: {
    borderColor: "#2e7d32",
    backgroundColor: "#e8f5e9",
  },
  projectName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 5,
  },
  projectDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  projectStatus: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
  },
  fieldName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 5,
  },
  fieldLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  fieldArea: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
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
    marginBottom: 15,
  },
  createButton: {
    backgroundColor: "#2e7d32",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
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
    width: 80,
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
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#666",
  },
  continueButton: {
    backgroundColor: "#2e7d32",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SelectProjectAndField;
