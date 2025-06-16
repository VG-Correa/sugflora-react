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
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import HeaderInterno from "../components/HeaderInterno";

const EditProject = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { projeto } = route.params;

  const [projetoEditado, setProjetoEditado] = useState({
    id: projeto.id,
    nome: projeto.nome || "",
    descricao: projeto.descricao || "",
    inicio: projeto.inicio ? new Date(projeto.inicio) : new Date(),
    termino: projeto.termino ? new Date(projeto.termino) : null,
    previsaoConclusao: projeto.previsaoConclusao
      ? new Date(projeto.previsaoConclusao)
      : null,
    responsavel_uuid: projeto.responsavel_uuid || "",
    imagemBase64: null,
    isPublic: projeto.isPublic || false,
  });

  const [loading, setLoading] = useState(false);

  const handleDateChange = (field, date) => {
    setProjetoEditado((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleSelectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled) {
        setProjetoEditado((prev) => ({
          ...prev,
          imagemBase64: result.assets[0].base64,
        }));
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      Alert.alert("Erro", "Não foi possível selecionar a imagem");
    }
  };

  const validarDatas = () => {
    if (
      projetoEditado.termino &&
      projetoEditado.termino < projetoEditado.inicio
    ) {
      Alert.alert(
        "Erro",
        "A data de término não pode ser anterior à data de início"
      );
      return false;
    }
    if (
      projetoEditado.previsaoConclusao &&
      projetoEditado.previsaoConclusao < projetoEditado.inicio
    ) {
      Alert.alert(
        "Erro",
        "A previsão de conclusão não pode ser anterior à data de início"
      );
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!projetoEditado.nome) {
      Alert.alert("Erro", "Por favor, preencha o nome do projeto");
      return;
    }

    if (!validarDatas()) {
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const user_id = await AsyncStorage.getItem("user_id");

      if (!user_id) {
        throw new Error("Usuário não identificado");
      }

      if (!token) {
        throw new Error("Token não encontrado. Faça login novamente.");
      }

      const projetoData = {
        id: projetoEditado.id,
        nome: projetoEditado.nome.trim(),
        descricao: projetoEditado.descricao?.trim() || "",
        inicio: projetoEditado.inicio.toISOString().split("T")[0],
        termino: projetoEditado.termino
          ? projetoEditado.termino.toISOString().split("T")[0]
          : null,
        previsaoConclusao: projetoEditado.previsaoConclusao
          ? projetoEditado.previsaoConclusao.toISOString().split("T")[0]
          : null,
        responsavel: projetoEditado.responsavel_uuid || "",
        usuario_dono_uuid: user_id,
        imagemBase64: projetoEditado.imagemBase64 || "",
        public: projetoEditado.isPublic,
      };

      console.log("Dados do projeto sendo enviados:", projetoData);

      const response = await axios.put(
        `http://localhost:8080/api/projeto/${projetoEditado.id}`,
        projetoData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/hal+json",
          },
        }
      );

      console.log("Resposta da API:", {
        status: response.status,
        data: response.data,
      });

      if (response.status === 200) {
        Alert.alert("Sucesso", "Projeto atualizado com sucesso!", [
          {
            text: "OK",
            onPress: () => navigation.navigate("MyProjects"),
          },
        ]);
      } else {
        throw new Error(response.data?.message || "Erro ao atualizar projeto");
      }
    } catch (error) {
      console.error("Erro ao atualizar projeto:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          error.message ||
          "Não foi possível atualizar o projeto. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderDatePicker = (label, value, onChange, minDate) => {
    if (Platform.OS === "web") {
      return (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{label}</Text>
          <input
            type="date"
            value={value ? value.toISOString().split("T")[0] : ""}
            onChange={(e) => {
              const date = new Date(e.target.value);
              date.setHours(0, 0, 0, 0);
              onChange(date);
            }}
            min={minDate ? minDate.toISOString().split("T")[0] : undefined}
            style={{
              padding: 10,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 5,
              fontSize: 16,
              width: "100%",
              backgroundColor: "#fff",
            }}
          />
        </View>
      );
    }

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            DateTimePickerAndroid.open({
              value: value || new Date(),
              onChange: (event, selectedDate) => {
                if (selectedDate) {
                  onChange(selectedDate);
                }
              },
              mode: "date",
              minimumDate: minDate,
            });
          }}
        >
          <Text style={styles.dateButtonText}>
            {value ? value.toLocaleDateString("pt-BR") : "Selecione uma data"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderInterno />
      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.title}>Editar Projeto</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome do Projeto</Text>
            <TextInput
              style={styles.input}
              value={projetoEditado.nome}
              onChangeText={(text) =>
                setProjetoEditado((prev) => ({ ...prev, nome: text }))
              }
              placeholder="Digite o nome do projeto"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={projetoEditado.descricao}
              onChangeText={(text) =>
                setProjetoEditado((prev) => ({ ...prev, descricao: text }))
              }
              placeholder="Digite a descrição do projeto"
              multiline
              numberOfLines={4}
            />
          </View>

          {renderDatePicker(
            "Data de Início",
            projetoEditado.inicio,
            (date) => handleDateChange("inicio", date),
            new Date()
          )}

          {renderDatePicker(
            "Data de Término",
            projetoEditado.termino,
            (date) => handleDateChange("termino", date),
            projetoEditado.inicio
          )}

          {renderDatePicker(
            "Previsão de Conclusão",
            projetoEditado.previsaoConclusao,
            (date) => handleDateChange("previsaoConclusao", date),
            projetoEditado.inicio
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Responsável</Text>
            <TextInput
              style={styles.input}
              value={projetoEditado.responsavel_uuid}
              onChangeText={(text) =>
                setProjetoEditado((prev) => ({
                  ...prev,
                  responsavel_uuid: text,
                }))
              }
              placeholder="Digite o UUID do responsável"
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.label}>Projeto Público</Text>
            <Switch
              value={projetoEditado.isPublic}
              onValueChange={(value) =>
                setProjetoEditado((prev) => ({ ...prev, isPublic: value }))
              }
            />
          </View>

          <TouchableOpacity
            style={styles.imageButton}
            onPress={handleSelectImage}
          >
            <Text style={styles.imageButtonText}>
              {projetoEditado.imagemBase64
                ? "Alterar Imagem"
                : "Adicionar Imagem"}
            </Text>
          </TouchableOpacity>

          {projetoEditado.imagemBase64 && (
            <Image
              source={{
                uri: `data:image/jpeg;base64,${projetoEditado.imagemBase64}`,
              }}
              style={styles.imagePreview}
            />
          )}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Salvando..." : "Salvar Alterações"}
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
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2e7d32",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  imageButton: {
    backgroundColor: "#2e7d32",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  imageButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2e7d32",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProject;
