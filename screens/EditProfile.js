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
import { useUsuarioData } from "../data/usuarios/UsuarioDataContext";
import MaskInput, { Masks } from "react-native-mask-input";
import Usuario from "../data/usuarios/Usuario";

const EditProfile = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const { getUsuarioById, updateUsuario } = useUsuarioData();
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
      const userDataToUpdate = new Usuario(
        parseInt(userData.uuid),
        userData.nome.trim(),
        userData.sobrenome?.trim() || "",
        userData.username.trim(),
        "", // senha - não alterar
        userData.rg.replace(/\D/g, ""),
        userData.cpf.replace(/\D/g, ""),
        userData.endereco?.trim() || "",
        userData.email.trim(),
        "USER",
        undefined, // created_at - não alterar
        new Date().toISOString() // updated_at
      );

      console.log("Enviando dados para atualização:", userDataToUpdate);

      const response = await updateUsuario(userDataToUpdate);
      console.log("Resposta do servidor:", response);

      if (response && response.status === 200) {
        // Atualiza os dados no AsyncStorage com os dados retornados do servidor
        const updatedUser = response.data;
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
        throw new Error(response?.message || "Erro ao atualizar perfil");
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      let errorMessage =
        "Não foi possível atualizar seu perfil. Por favor, tente novamente.";

      if (error.message) {
        errorMessage = error.message;
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
              autoCapitalize="none"
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
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CPF</Text>
            <MaskInput
              style={styles.input}
              value={userData.cpf}
              onChangeText={(masked, unmasked) =>
                setUserData({ ...userData, cpf: masked })
              }
              mask={Masks.BRL_CPF}
              keyboardType="numeric"
              placeholder="000.000.000-00"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>RG</Text>
            <MaskInput
              style={styles.input}
              value={userData.rg}
              onChangeText={(masked, unmasked) =>
                setUserData({ ...userData, rg: masked })
              }
              mask={[
                /\d/,
                /\d/,
                ".",
                /\d/,
                /\d/,
                /\d/,
                ".",
                /\d/,
                /\d/,
                /\d/,
                "-",
                /[\dXx]/,
              ]}
              keyboardType="numeric"
              placeholder="00.000.000-0"
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

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.disabledButton]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>SALVAR ALTERAÇÕES</Text>
          )}
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
  disabledButton: {
    opacity: 0.7,
  },
});

export default EditProfile;
