import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderInterno from "../components/HeaderInterno";
import axios from "axios";

const EditProfile = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
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
        const uuid = await AsyncStorage.getItem("uuid");
        const nome = await AsyncStorage.getItem("nome");
        const sobrenome = await AsyncStorage.getItem("sobrenome");
        const email = await AsyncStorage.getItem("email");
        const username = await AsyncStorage.getItem("username");
        const cpf = await AsyncStorage.getItem("cpf");
        const rg = await AsyncStorage.getItem("rg");
        const endereco = await AsyncStorage.getItem("endereco");

        if (!uuid || !nome || !email) {
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
      }
    };

    loadUserData();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const API_URL = "http://10.0.2.2:8080"; // URL para Android Emulator

      // Validação básica dos campos
      if (
        !userData.nome ||
        !userData.email ||
        !userData.username ||
        !userData.cpf ||
        !userData.rg
      ) {
        Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios");
        setLoading(false);
        return;
      }

      // Prepara os dados para envio
      const userDataToUpdate = {
        uuid: userData.uuid,
        nome: userData.nome,
        sobrenome: userData.sobrenome || "",
        email: userData.email,
        username: userData.username,
        cpf: userData.cpf,
        rg: userData.rg,
        endereco: userData.endereco || "",
        role: "USER",
      };

      console.log("Enviando dados para atualização:", userDataToUpdate);

      const response = await axios.put(
        `${API_URL}/api/usuario`,
        userDataToUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Resposta do servidor:", response.data);

      if (response.data && response.data.data) {
        // Atualiza os dados no AsyncStorage
        await AsyncStorage.setItem("nome", userData.nome);
        await AsyncStorage.setItem("sobrenome", userData.sobrenome || "");
        await AsyncStorage.setItem("email", userData.email);
        await AsyncStorage.setItem("username", userData.username);
        await AsyncStorage.setItem("cpf", userData.cpf);
        await AsyncStorage.setItem("rg", userData.rg);
        await AsyncStorage.setItem("endereco", userData.endereco || "");

        Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
        navigation.goBack();
      } else {
        throw new Error("Resposta inválida do servidor");
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      let errorMessage =
        "Não foi possível atualizar seu perfil. Por favor, tente novamente.";

      if (error.response) {
        console.log("Detalhes do erro:", error.response.data);
        if (error.response.status === 401) {
          errorMessage = "Sua sessão expirou. Por favor, faça login novamente.";
          navigation.navigate("Login");
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }

      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderInterno />
      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <Text style={styles.profileTitle}>Editar Perfil</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              value={userData.nome}
              onChangeText={(text) => setUserData({ ...userData, nome: text })}
              placeholder="Digite seu nome"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sobrenome</Text>
            <TextInput
              style={styles.input}
              value={userData.sobrenome}
              onChangeText={(text) =>
                setUserData({ ...userData, sobrenome: text })
              }
              placeholder="Digite seu sobrenome"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={userData.email}
              onChangeText={(text) => setUserData({ ...userData, email: text })}
              placeholder="Digite seu e-mail"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome de Usuário</Text>
            <TextInput
              style={styles.input}
              value={userData.username}
              onChangeText={(text) =>
                setUserData({ ...userData, username: text })
              }
              placeholder="Digite seu nome de usuário"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CPF</Text>
            <TextInput
              style={styles.input}
              value={userData.cpf}
              onChangeText={(text) => setUserData({ ...userData, cpf: text })}
              placeholder="Digite seu CPF"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>RG</Text>
            <TextInput
              style={styles.input}
              value={userData.rg}
              onChangeText={(text) => setUserData({ ...userData, rg: text })}
              placeholder="Digite seu RG"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Endereço</Text>
            <TextInput
              style={styles.input}
              value={userData.endereco}
              onChangeText={(text) =>
                setUserData({ ...userData, endereco: text })
              }
              placeholder="Digite seu endereço"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>SALVAR ALTERAÇÕES</Text>
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
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  saveButton: {
    backgroundColor: "#2e7d32",
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProfile;
