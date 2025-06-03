import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderInterno from "../components/HeaderInterno";

const HomeScreen = () => {
  const navigation = useNavigation();
  const windowWidth = Dimensions.get("window").width;
  const isMobile = windowWidth < 768;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        const userToken = await AsyncStorage.getItem("userToken");

        if (!storedUserData || !userToken) {
          Alert.alert("Erro", "Sessão expirada");
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
          return;
        }

        setUserData(JSON.parse(storedUserData));
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
        Alert.alert("Erro", "Erro ao carregar dados do usuário");
      }
    };

    checkUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderInterno onLogout={handleLogout} userData={userData} />
      <ScrollView style={styles.content}>
        <View style={styles.mainContent}>
          {/* Seção de boas-vindas */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>
              Bem-vindo(a), {userData?.nome} {userData?.sobrenome}!
            </Text>
          </View>

          <View
            style={[
              styles.gridContainer,
              isMobile && styles.gridContainerMobile,
            ]}
          >
            <View style={[styles.gridRow, isMobile && styles.gridRowMobile]}>
              <View
                style={[
                  styles.profileContainer,
                  isMobile && styles.profileContainerMobile,
                ]}
              >
                <Text style={styles.gridTitle}>Projetos</Text>
                <Image
                  source={require("../assets/images/2.webp")}
                  style={styles.profileImage}
                />
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate("MyProjects")}
                >
                  <Text style={styles.buttonText}>Meus projetos</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate("NewProject")}
                >
                  <Text style={styles.buttonText}>Criar projeto</Text>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.profileContainer,
                  isMobile && styles.profileContainerMobile,
                ]}
              >
                <Text style={styles.gridTitle}>Espécies</Text>
                <Image
                  source={require("../assets/images/3.webp")}
                  style={styles.profileImage}
                />
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate("SearchSpecies")}
                >
                  <Text style={styles.buttonText}>Pesquisar espécie</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate("MyCollection")}
                >
                  <Text style={styles.buttonText}>Minhas coletas</Text>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.profileContainer,
                  isMobile && styles.profileContainerMobile,
                ]}
              >
                <Text style={styles.gridTitle}>Flora Match</Text>
                <Image
                  source={require("../assets/images/4.webp")}
                  style={styles.profileImage}
                />
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate("IdentifyPlant")}
                >
                  <Text style={styles.buttonText}>Ajude-me a identificar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => navigation.navigate("KnownPlants")}
                >
                  <Text style={styles.buttonText}>Eu conheço essa</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  mainContent: {
    padding: 15,
  },
  welcomeSection: {
    padding: 20,
    marginBottom: 20,
    backgroundColor: "#e8f5e9",
    borderRadius: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e7d32",
    textAlign: "center",
  },
  gridContainer: {
    width: "100%",
  },
  gridContainerMobile: {
    paddingHorizontal: 10,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  gridRowMobile: {
    flexDirection: "column",
    alignItems: "center",
  },
  profileContainer: {
    width: "30%",
    minWidth: 250,
    backgroundColor: "#e8f5e9",
    borderRadius: 10,
    alignItems: "center",
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileContainerMobile: {
    width: "100%",
    maxWidth: 350,
    marginHorizontal: 0,
    marginBottom: 20,
  },
  gridTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 10,
    textAlign: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    resizeMode: "cover",
  },
  actionButton: {
    width: "100%",
    height: 40,
    backgroundColor: "#2e7d32",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default HomeScreen;
