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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import projetoApi from "../functions/api/projetoApi";
import HeaderInterno from "../components/HeaderInterno";

const coresAbas = ["#b2d8b2", "#ccc", "#f8a5a5"]; // Verde, cinza, vermelho

const MyProjects = () => {
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const cardWidth = width > 768 ? "30%" : width > 480 ? "45%" : "90%";

  async function fetchProjetos() {
    try {
      setLoading(true);
      setError(null);
      const user_id = localStorage.getItem("user_id");

      if (!user_id) throw new Error("Usuário não autenticado");

      const response = await projetoApi.getProjetos(user_id);

      if (response.status === 200) {
        const projetosAtivos = response.data.data || [];
        setProjetos(projetosAtivos.filter((projeto) => !projeto.deleted));
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

  // FUNÇÃO CORRIGIDA PARA LER O ARRAY DE DATA
  const formatDate = (dateArray) => {
    try {
      // Verifica se o input é um array e tem pelo menos 3 elementos (ano, mês, dia)
      if (!Array.isArray(dateArray) || dateArray.length < 3) {
        // Se a data for nula (como em um 'termino' opcional), retorna "Não definida"
        if (dateArray === null || dateArray === undefined) {
          return "Não definida";
        }
        return "Data inválida";
      }

      // Pega os 3 primeiros valores do array
      const [ano, mes, dia] = dateArray;

      // Formata para garantir dois dígitos para dia e mês
      const diaFormatado = String(dia).padStart(2, "0");
      const mesFormatado = String(mes).padStart(2, "0");

      return `${diaFormatado}/${mesFormatado}/${ano}`;
    } catch (e) {
      console.error("Erro ao formatar array de data:", e);
      return "Data inválida";
    }
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
        <Text style={styles.pageTitle}>MEUS PROJETOS</Text>

        <View style={[styles.projectsGrid, { width: "100%" }]}>
          {projetos.map((projeto, index) => {
            const corAba = coresAbas[index % coresAbas.length];
            return (
              <View
                key={projeto.id}
                style={[styles.projectCard, { width: cardWidth }]}
              >
                <View style={[styles.folderTab, { backgroundColor: corAba }]}>
                  <Text style={styles.projectTitle}>{projeto.nome}</Text>
                  {projeto.imagemUrl && (
                    <Image
                      source={{ uri: projetoApi.baseUrl + projeto.imagemUrl }}
                      style={styles.projectImage}
                    />
                  )}
                </View>

                <View style={styles.projectBody}>
                  <Text style={styles.label}>Descrição:</Text>
                  <Text style={styles.value}>{projeto.descricao || "-"}</Text>

                  <Text style={styles.label}>Data de Início:</Text>
                  <Text style={styles.value}>
                    {formatDate(projeto.inicio)}
                  </Text>

                  {/* A condição projeto.termino já filtra os nulos antes de chamar a função */}
                  {projeto.termino && (
                    <>
                      <Text style={styles.label}>Previsão de Conclusão:</Text>
                      <Text style={styles.value}>
                        {formatDate(projeto.termino)}
                      </Text>
                    </>
                  )}

                  {projeto.responsavel && (
                    <>
                      <Text style={styles.label}>Responsável:</Text>
                      <Text style={styles.value}>{projeto.responsavel}</Text>
                    </>
                  )}

                  <TouchableOpacity
                    style={[styles.openButton, { backgroundColor: corAba }]}
                    onPress={() =>
                      navigation.navigate("ProjectScreen", { projeto })
                    }
                  >
                    <Text style={styles.buttonText}>Ver projeto</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
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
    alignItems: "center",
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
  },
  projectImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  projectBody: {
    backgroundColor: "#dcedc8",
    padding: 10,
  },
  label: {
    fontSize: 12,
    color: "#555",
    fontWeight: "bold",
  },
  value: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  openButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
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
});

export default MyProjects;