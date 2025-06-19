import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderInterno from "../components/HeaderInterno";

const Profile = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    uuid: "",
    nome: "",
    sobrenome: "",
    email: "",
    username: "",
    cpf: "",
    rg: "",
    endereco: "",
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const uuid = await AsyncStorage.getItem("user_id");
        const nome = await AsyncStorage.getItem("nome");
        const sobrenome = await AsyncStorage.getItem("sobrenome");
        const email = await AsyncStorage.getItem("email");
        const username = await AsyncStorage.getItem("username");
        const cpf = await AsyncStorage.getItem("cpf");
        const rg = await AsyncStorage.getItem("rg");
        const endereco = await AsyncStorage.getItem("endereco");

        if (!nome || !email) {
          Alert.alert("Erro", "Dados do usuário não encontrados");
          navigation.navigate("Login");
          return;
        }

        setUserData({
          uuid,
          nome,
          sobrenome,
          email,
          username,
          cpf,
          rg,
          endereco,
        });
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        Alert.alert("Erro", "Não foi possível carregar seus dados");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  const renderInfoItem = (label, value) => (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || "Não informado"}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderInterno />
      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <Text style={styles.profileTitle}>Meu Perfil</Text>
          <Text style={styles.profileSubtitle}>
            {userData.nome} {userData.sobrenome}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          {renderInfoItem("Nome", userData.nome)}
          {renderInfoItem("Sobrenome", userData.sobrenome)}
          {renderInfoItem("E-mail", userData.email)}
          {renderInfoItem("Nome de Usuário", userData.username)}
          {renderInfoItem("CPF", userData.cpf)}
          {renderInfoItem("RG", userData.rg)}
          {renderInfoItem("Endereço", userData.endereco)}
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            console.log("Navegando para EditProfile");
            navigation.navigate("EditProfile", { userData });
          }}
        >
          <Text style={styles.editButtonText}>EDITAR PERFIL</Text>
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
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    padding: 20,
    backgroundColor: "#2e7d32",
    alignItems: "center",
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  profileSubtitle: {
    fontSize: 18,
    color: "#fff",
    opacity: 0.9,
  },
  infoContainer: {
    padding: 20,
  },
  infoItem: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
  },
  editButton: {
    backgroundColor: "#2e7d32",
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Profile;
