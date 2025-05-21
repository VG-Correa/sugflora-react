import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import projetoApi from "../functions/api/projetoApi";
import HeaderInterno from "../components/HeaderInterno";

const MyProjects = () => {
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  // Calcula a quantidade de colunas baseado na largura da tela
  const numColumns = width > 768 ? 3 : width > 480 ? 2 : 1;
  const cardWidth = width > 768 ? '30%' : width > 480 ? '45%' : '90%';

  async function fetchProjetos() {
    try {
      setLoading(true);
      setError(null);
      const user_id = localStorage.getItem("user_id");
      
      if (!user_id) {
        throw new Error("Usuário não autenticado");
      }

      const response = await projetoApi.getProjetos(user_id);

      if (response.status === 200) {
        setProjetos(response.data.data || []);
      } else {
        throw new Error("Erro ao carregar projetos");
      }
    } catch (err) {
      console.error("Erro:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjetos();
  }, []);

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
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={fetchProjetos}
          >
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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>MEUS PROJETOS</Text>

        {projetos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum projeto encontrado</Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => navigation.navigate('CreateProject')}
            >
              <Text style={styles.buttonText}>Criar novo projeto</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.projectsGrid, { width: '100%' }]}>
            {projetos.map((projeto) => (
              <View 
                key={projeto.id} 
                style={[styles.projectContainer, { width: cardWidth }]}
              >
                <Text style={styles.projectHeader}>{projeto.nome}</Text>

                <TextInput
                  style={styles.inputField}
                  editable={false}
                  value={projeto.deleted ? "Privado" : "Publicado"}
                />

                <TouchableOpacity
                  style={styles.openButton}
                  onPress={() => navigation.navigate("ProjectScreen", { projeto })}
                >
                  <Text style={styles.buttonText}>Abrir Projeto</Text>
                </TouchableOpacity>
              </View>
            ))}
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
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    color: '#2e7d32',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 25,
    textAlign: "center",
  },
  projectsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
    paddingBottom: 20,
  },
  projectContainer: {
    backgroundColor: "#e8f5e9",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 200, // Largura mínima para os cards
  },
  projectHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
    textAlign: "center",
    marginBottom: 15,
  },
  inputField: {
    width: "100%",
    height: 40,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: "#333",
    textAlign: 'center',
  },
  openButton: {
    backgroundColor: "#2e7d32",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  retryButton: {
    backgroundColor: "#d32f2f",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  createButton: {
    backgroundColor: "#2e7d32",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 15,
    minWidth: 200,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 15,
  },
});

export default MyProjects;