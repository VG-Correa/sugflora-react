
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderInterno from "../components/HeaderInterno";
import MaskInput, { Masks } from "react-native-mask-input";

const Profile = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({
    uuid: "",
    username: "",
    nome: "",
    sobrenome: "",
    email: "",
    cpf: "",
    rg: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    senha: "",
    novaSenha: "",
    confirmarSenha: "",
    role: "",
  });

  // Carregar dados do usuário
  useEffect(() => {
    const loadUserData = async () => {
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

        const parsedData = JSON.parse(storedUserData);

        // Buscar dados atualizados do usuário usando UUID
        const response = await fetch(
          `http://localhost:8080/api/usuario/${parsedData.uuid}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const apiData = await response.json();
          console.log("Dados do usuário recebidos:", apiData);

          // Combinar os dados da API com o parsing do endereço
          const userData = {
            ...apiData.data,
            ...parseEndereco(apiData.data.endereco || ""),
          };

          setUserData(userData);
        } else {
          const error = await response.json();
          console.error("Erro ao buscar dados:", error);
          Alert.alert(
            "Erro",
            error.message || "Erro ao carregar dados do usuário"
          );
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        Alert.alert("Erro", "Não foi possível carregar seus dados");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleSave = async () => {
    if (!userData.uuid) {
      Alert.alert("Erro", "UUID do usuário não encontrado");
      return;
    }

    if (!userData.email || !userData.username) {
      Alert.alert("Erro", "Email e username são obrigatórios");
      return;
    }

    setSaving(true);
    try {
      const userToken = await AsyncStorage.getItem("userToken");

      // Preparar dados para atualização conforme UsuarioWriteDTO
      const updateData = {
        uuid: userData.uuid,
        username: userData.username,
        nome: userData.nome,
        sobrenome: userData.sobrenome,
        email: userData.email,
        cpf: userData.cpf,
        rg: userData.rg,
        endereco: `${userData.endereco}${
          userData.numero ? `, ${userData.numero}` : ""
        }${userData.complemento ? `, ${userData.complemento}` : ""} - ${
          userData.bairro
        }, ${userData.cidade}/${userData.estado}${
          userData.cep ? ` - CEP: ${userData.cep}` : ""
        }`,
        role: userData.role || "USER",
      };

      // Se estiver alterando a senha
      if (userData.novaSenha) {
        if (userData.novaSenha !== userData.confirmarSenha) {
          Alert.alert("Erro", "As senhas não coincidem");
          return;
        }
        updateData.senha = userData.novaSenha;
      }

      console.log("Dados sendo enviados para atualização:", updateData);

      const response = await fetch("http://localhost:8080/api/usuario", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const responseData = await response.json();
      console.log("Resposta da atualização:", responseData);

      if (response.ok) {
        // Atualizar dados no AsyncStorage
        const userDataToStore = {
          ...responseData.data,
          // Separar o endereço em seus componentes
          ...parseEndereco(responseData.data.endereco),
        };

        await AsyncStorage.setItem("userData", JSON.stringify(userDataToStore));
        Alert.alert("Sucesso", "Dados atualizados com sucesso");

        // Limpar campos de senha
        setUserData((prev) => ({
          ...prev,
          senha: "",
          novaSenha: "",
          confirmarSenha: "",
        }));
      } else {
        Alert.alert("Erro", responseData.message || "Erro ao atualizar dados");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("Erro", "Não foi possível salvar as alterações");
    } finally {
      setSaving(false);
    }
  };

  // Função para separar o endereço em seus componentes
  const parseEndereco = (enderecoCompleto) => {
    try {
      let endereco = "",
        numero = "",
        complemento = "",
        bairro = "",
        cidade = "",
        estado = "",
        cep = "";

      // Separar CEP
      const cepMatch = enderecoCompleto.match(/CEP: (\d{5}-\d{3})/);
      if (cepMatch) {
        cep = cepMatch[1];
        enderecoCompleto = enderecoCompleto.replace(` - CEP: ${cep}`, "");
      }

      // Separar cidade e estado
      const cidadeEstadoMatch = enderecoCompleto.match(
        /(.*), ([^/]+)\/([A-Z]{2})/
      );
      if (cidadeEstadoMatch) {
        cidade = cidadeEstadoMatch[2];
        estado = cidadeEstadoMatch[3];
        enderecoCompleto = cidadeEstadoMatch[1];
      }

      // Separar bairro
      const bairroMatch = enderecoCompleto.match(/(.*) - (.*)/);
      if (bairroMatch) {
        bairro = bairroMatch[2];
        enderecoCompleto = bairroMatch[1];
      }

      // Separar número e complemento
      const numeroComplementoMatch =
        enderecoCompleto.match(/(.*?), (\d+)(, .*)?/);
      if (numeroComplementoMatch) {
        endereco = numeroComplementoMatch[1];
        numero = numeroComplementoMatch[2];
        complemento = numeroComplementoMatch[3]
          ? numeroComplementoMatch[3].replace(", ", "")
          : "";
      } else {
        endereco = enderecoCompleto;
      }

      return {
        endereco,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep,
      };
    } catch (error) {
      console.error("Erro ao processar endereço:", error);
      return {};
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
        <Text style={styles.pageTitle}>EDITAR PERFIL</Text>

        <View style={styles.profileSection}>
          {/* Dados não editáveis */}
          <View style={styles.dataSection}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>NOME</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={userData.nome}
                editable={false}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>SOBRENOME</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={userData.sobrenome}
                editable={false}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>CPF</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={userData.cpf}
                editable={false}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>RG</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={userData.rg}
                editable={false}
              />
            </View>
          </View>
        </View>

        {/* Campos editáveis */}
        <View style={styles.bottomSection}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>CEP</Text>
            <MaskInput
              style={styles.input}
              value={userData.cep}
              onChangeText={(masked, unmasked) =>
                setUserData((prev) => ({ ...prev, cep: masked }))
              }
              mask={Masks.ZIP_CODE}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>ENDEREÇO</Text>
            <TextInput
              style={styles.input}
              value={userData.endereco}
              onChangeText={(text) =>
                setUserData((prev) => ({ ...prev, endereco: text }))
              }
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>NÚMERO</Text>
            <TextInput
              style={styles.input}
              value={userData.numero}
              onChangeText={(text) =>
                setUserData((prev) => ({ ...prev, numero: text }))
              }
              keyboardType="numeric"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>COMPLEMENTO</Text>
            <TextInput
              style={styles.input}
              value={userData.complemento}
              onChangeText={(text) =>
                setUserData((prev) => ({ ...prev, complemento: text }))
              }
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>BAIRRO</Text>
            <TextInput
              style={styles.input}
              value={userData.bairro}
              onChangeText={(text) =>
                setUserData((prev) => ({ ...prev, bairro: text }))
              }
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>CIDADE</Text>
            <TextInput
              style={styles.input}
              value={userData.cidade}
              onChangeText={(text) =>
                setUserData((prev) => ({ ...prev, cidade: text }))
              }
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>ESTADO</Text>
            <TextInput
              style={styles.input}
              value={userData.estado}
              onChangeText={(text) =>
                setUserData((prev) => ({ ...prev, estado: text }))
              }
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>E-MAIL</Text>
            <TextInput
              style={styles.input}
              value={userData.email}
              onChangeText={(text) =>
                setUserData((prev) => ({ ...prev, email: text }))
              }
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.passwordSection}>
            <Text style={styles.sectionTitle}>Alterar Senha</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>SENHA ATUAL</Text>
              <TextInput
                style={styles.input}
                value={userData.senha}
                onChangeText={(text) =>
                  setUserData((prev) => ({ ...prev, senha: text }))
                }
                secureTextEntry
                placeholder="Digite sua senha atual"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>NOVA SENHA</Text>
              <TextInput
                style={styles.input}
                value={userData.novaSenha}
                onChangeText={(text) =>
                  setUserData((prev) => ({ ...prev, novaSenha: text }))
                }
                secureTextEntry
                placeholder="Digite a nova senha"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>CONFIRMAR NOVA SENHA</Text>
              <TextInput
                style={styles.input}
                value={userData.confirmarSenha}
                onChangeText={(text) =>
                  setUserData((prev) => ({ ...prev, confirmarSenha: text }))
                }
                secureTextEntry
                placeholder="Confirme a nova senha"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.disabledButton]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
            </Text>
          </TouchableOpacity>
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
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#2e7d32",
  },
  profileSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dataSection: {
    flex: 1,
  },
  bottomSection: {
    paddingHorizontal: 20,
  },
  fieldGroup: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  disabledInput: {
    backgroundColor: "#e0e0e0",
    color: "#666",
  },
  passwordSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: "#2e7d32",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default Profile;
