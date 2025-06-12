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
  Platform,
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
        const uuid = await AsyncStorage.getItem("user_id");
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
          uuid: uuid,
          nome: nome || "",
          sobrenome: sobrenome || "",
          email: email || "",
          username: username || "",
          cpf: cpf || "",
          rg: rg || "",
          endereco: endereco || "",
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
      // Ajustando a URL para o ambiente correto
      const API_URL = Platform.select({
        android: "http://10.0.2.2:8080", // Android Emulator
        ios: "http://localhost:8080", // iOS Simulator
        default: "http://localhost:8080", // Fallback
      });

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

      // Validação de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        Alert.alert("Erro", "Por favor, insira um e-mail válido");
        setLoading(false);
        return;
      }

      // Validação de CPF (apenas números)
      const cpfRegex = /^\d{11}$/;
      if (!cpfRegex.test(userData.cpf.replace(/\D/g, ""))) {
        Alert.alert("Erro", "CPF deve conter 11 dígitos numéricos");
        setLoading(false);
        return;
      }

      // Prepara os dados para envio
      const userDataToUpdate = {
        uuid: userData.uuid,
        nome: userData.nome.trim(),
        sobrenome: userData.sobrenome?.trim() || "",
        email: userData.email.trim(),
        username: userData.username.trim(),
        cpf: userData.cpf.replace(/\D/g, ""),
        rg: userData.rg.trim(),
        endereco: userData.endereco?.trim() || "",
        role: "USER",
      };

      console.log("Enviando dados para atualização:", userDataToUpdate);
      console.log("URL da API:", `${API_URL}/api/usuario`);
      console.log("Token:", token);

      const response = await axios.put(
        `${API_URL}/api/usuario`,
        userDataToUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          validateStatus: function (status) {
            return status < 500;
          },
        }
      );

      console.log("Resposta do servidor:", response.data);

      if (response.status === 200 && response.data && response.data.data) {
        // Atualiza os dados no AsyncStorage com os dados retornados do servidor
        const updatedUser = response.data.data;
        await AsyncStorage.multiSet([
          ["nome", updatedUser.nome || ""],
          ["sobrenome", updatedUser.sobrenome || ""],
          ["email", updatedUser.email || ""],
          ["username", updatedUser.username || ""],
          ["cpf", updatedUser.cpf || ""],
          ["rg", updatedUser.rg || ""],
          ["endereco", updatedUser.endereco || ""],
        ]);

        // Atualiza o estado local com os dados atualizados
        setUserData({
          ...userData,
          nome: updatedUser.nome || "",
          sobrenome: updatedUser.sobrenome || "",
          email: updatedUser.email || "",
          username: updatedUser.username || "",
          cpf: updatedUser.cpf || "",
          rg: updatedUser.rg || "",
          endereco: updatedUser.endereco || "",
        });

        Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
        navigation.goBack();
      } else {
        throw new Error(response.data?.message || "Erro ao atualizar perfil");
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      let errorMessage =
        "Não foi possível atualizar seu perfil. Por favor, tente novamente.";

      if (error.response) {
        console.log("Detalhes do erro:", error.response.data);
        console.log("Status do erro:", error.response.status);

        if (error.response.status === 401) {
          errorMessage = "Sua sessão expirou. Por favor, faça login novamente.";
          navigation.navigate("Login");
        } else if (error.response.status === 403) {
          errorMessage = "Acesso negado. Verifique suas permissões.";
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
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
