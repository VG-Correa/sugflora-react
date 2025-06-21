import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import HeaderInterno from "../components/HeaderInterno";
import { useEspecieData } from "../data/especies/EspecieDataContext";

const SpeciesSearchScreen = () => {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Usando o contexto de dados de espécies
  const { searchEspeciesByNome, getEspecieById } = useEspecieData();

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      alert("Por favor, digite um termo de busca");
      return;
    }

    setIsSearching(true);
    try {
      const result = searchEspeciesByNome(searchTerm.trim());
      if (result.status === 200 && result.data && result.data.length > 0) {
        setSearchResult(result.data[0]); // Pega a primeira espécie encontrada
      } else {
        setSearchResult(null);
        alert("Nenhuma espécie encontrada com este nome");
      }
    } catch (error) {
      console.error("Erro na busca:", error);
      alert("Erro ao realizar a busca");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <HeaderInterno />

      <ScrollView style={styles.scrollView}>
        <View style={styles.mainContent}>
          {/* Título */}
          <Text style={styles.pageTitle}>PESQUISA DE ESPÉCIE</Text>

          {/* Caixa de pesquisa com ícone de lupa */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Digite o nome da espécie..."
              placeholderTextColor="#999"
              value={searchTerm}
              onChangeText={setSearchTerm}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity onPress={handleSearch} disabled={isSearching}>
              <Ionicons name="search" size={24} color="#2e7d32" />
            </TouchableOpacity>
          </View>

          {/* Resultado da pesquisa */}
          {searchResult && (
            <>
              <Text style={styles.resultHeader}>Resultado da Pesquisa</Text>
              <View style={styles.resultContainer}>
                {/* Imagem */}
                <Image
                  source={require("../assets/images/sem-imagem.webp")}
                  style={styles.speciesImage}
                  resizeMode="contain"
                />

                {/* Informações da espécie */}
                <View style={styles.infoContainer}>
                  <View style={styles.resultSection}>
                    <Text style={styles.resultLabel}>Nome Científico</Text>
                    <Text style={styles.resultText}>{searchResult.nome}</Text>
                  </View>
                  <View style={styles.resultSection}>
                    <Text style={styles.resultLabel}>Nome Popular</Text>
                    <Text style={styles.resultText}>
                      {searchResult.nome_comum || "Não informado"}
                    </Text>
                  </View>
                  <View style={styles.resultSection}>
                    <Text style={styles.resultLabel}>
                      Características Principais
                    </Text>
                    <Text style={styles.resultText}>
                      {searchResult.caracteristicas || "Não informado"}
                    </Text>
                  </View>
                  <View style={styles.resultSection}>
                    <Text style={styles.resultLabel}>Habitat</Text>
                    <Text style={styles.resultText}>
                      {searchResult.habitat || "Não informado"}
                    </Text>
                  </View>
                  <View style={styles.resultSection}>
                    <Text style={styles.resultLabel}>
                      Distribuição Geográfica
                    </Text>
                    <Text style={styles.resultText}>
                      {searchResult.distribuicao_geografica || "Não informado"}
                    </Text>
                  </View>
                  <View style={styles.resultSection}>
                    <Text style={styles.resultLabel}>
                      Status de Conservação
                    </Text>
                    <Text style={styles.resultText}>
                      {searchResult.status_conservacao || "Não informado"}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Header
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
  menuItem: { paddingHorizontal: 10 },
  menuText: { color: "#fff", fontWeight: "bold", fontSize: 12 },

  scrollView: { flex: 1 },
  mainContent: { padding: 20 },

  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 20,
    textAlign: "center",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 30,
    height: 45,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },

  resultHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 20,
  },

  resultContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 20,
  },

  speciesImage: {
    width: 200,
    height: 200,
    backgroundColor: "#eee",
    borderRadius: 10,
  },

  infoContainer: {
    flex: 1,
    paddingLeft: 10,
  },

  resultSection: {
    marginBottom: 10,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 3,
  },
  resultText: {
    fontSize: 14,
    color: "#333",
  },
});

export default SpeciesSearchScreen;
