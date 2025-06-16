import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch,
  Platform,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import HeaderInterno from "../components/HeaderInterno";
import projetoApi from "../functions/api/projetoApi";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import DateTimePickerAndroid from "@react-native-community/datetimepicker";

const NewProject = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [showInicioPicker, setShowInicioPicker] = useState(false);
  const [showTerminoPicker, setShowTerminoPicker] = useState(false);
  const [showPrevisaoPicker, setShowPrevisaoPicker] = useState(false);
  const [imagem, setImagem] = useState(null);
  const [projeto, setProjeto] = useState({
    nome: "",
    descricao: "",
    isPublic: false,
    inicio: new Date(),
    termino: null,
    previsaoConclusao: null,
    responsavel_uuid: null,
    imagemBase64: null,
  });

  useEffect(() => {
    carregarUsuarios();
    solicitarPermissaoCamera();
  }, []);

  const solicitarPermissaoCamera = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de permissão para acessar suas fotos."
      );
    }
  };

  const selecionarImagem = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setImagem(result.assets[0].uri);
        setProjeto((prev) => ({
          ...prev,
          imagemBase64: base64Image,
        }));
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      Alert.alert("Erro", "Não foi possível selecionar a imagem");
    }
  };

  const carregarUsuarios = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get("http://10.0.2.2:8080/api/usuario", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data && response.data.data) {
        setUsuarios(response.data.data);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      Alert.alert("Erro", "Não foi possível carregar a lista de usuários");
    }
  };

  const formatarData = (data) => {
    if (!data) return "";
    return data.toLocaleDateString("pt-BR");
  };

  const handleDateChange = (event, selectedDate, tipo) => {
    if (Platform.OS === "android") {
      setShowInicioPicker(false);
      setShowTerminoPicker(false);
      setShowPrevisaoPicker(false);
    }

    if (selectedDate) {
      const adjustedDate = new Date(selectedDate);
      adjustedDate.setHours(0, 0, 0, 0);

      switch (tipo) {
        case "inicio":
          setProjeto((prev) => ({ ...prev, inicio: adjustedDate }));
          break;
        case "termino":
          setProjeto((prev) => ({ ...prev, termino: adjustedDate }));
          break;
        case "previsao":
          setProjeto((prev) => ({ ...prev, previsaoConclusao: adjustedDate }));
          break;
      }
    }
  };

  const validarDatas = () => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (projeto.inicio < hoje) {
      Alert.alert("Erro", "A data de início não pode ser anterior a hoje");
      return false;
    }

    if (projeto.termino && projeto.inicio > projeto.termino) {
      Alert.alert(
        "Erro",
        "A data de término não pode ser anterior à data de início"
      );
      return false;
    }

    if (
      projeto.previsaoConclusao &&
      projeto.inicio > projeto.previsaoConclusao
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
    if (!projeto.nome) {
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

      console.log("Token encontrado:", token ? "Sim" : "Não");
      console.log("User ID encontrado:", user_id);

      if (!user_id) {
        throw new Error("Usuário não identificado");
      }

      if (!token) {
        throw new Error("Token não encontrado. Faça login novamente.");
      }

      const projetoData = {
        id: 0,
        nome: projeto.nome.trim(),
        descricao: projeto.descricao?.trim() || "",
        inicio: projeto.inicio.toISOString().split("T")[0],
        previsaoConclusao: projeto.previsaoConclusao
          ? projeto.previsaoConclusao.toISOString().split("T")[0]
          : null,
        responsavel: projeto.responsavel_uuid || "",
        usuario_dono_uuid: user_id,
        imagemBase64: projeto.imagemBase64 || "",
        public: projeto.isPublic,
      };

      console.log("Dados do projeto sendo enviados:", projetoData);
      console.log("Headers sendo enviados:", {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/hal+json",
      });

      const response = await axios.post(
        "http://localhost:8080/api/projeto",
        projetoData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/hal+json",
          },
          validateStatus: function (status) {
            return status < 500;
          },
        }
      );

      console.log("Resposta da API:", {
        status: response.status,
        data: response.data,
        headers: response.headers,
      });

      if (response.status === 200) {
        navigation.reset({
          index: 0,
          routes: [{ name: "MyProjects" }],
        });
      } else {
        throw new Error(
          response.data?.message ||
            response.data?.error ||
            "Erro ao criar projeto"
        );
      }
    } catch (error) {
      console.error("Erro detalhado ao salvar projeto:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });

      let mensagemErro = "Não foi possível salvar o projeto. ";
      if (error.response?.data?.message) {
        mensagemErro += error.response.data.message;
      } else if (error.response?.data?.error) {
        mensagemErro += error.response.data.error;
      } else {
        mensagemErro += "Por favor, tente novamente.";
      }

      Alert.alert("Erro", mensagemErro);
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
            {value ? formatarData(value) : "Selecione uma data"}
          </Text>
        </TouchableOpacity>
      </View>
    );
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
        <Text style={styles.pageTitle}>CRIAR PROJETO</Text>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Projeto *</Text>
            <TextInput
              style={styles.input}
              value={projeto.nome}
              onChangeText={(text) => setProjeto({ ...projeto, nome: text })}
              placeholder="Digite o nome do projeto"
              maxLength={100}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={projeto.descricao}
              onChangeText={(text) =>
                setProjeto({ ...projeto, descricao: text })
              }
              placeholder="Digite a descrição do projeto"
              multiline
              numberOfLines={4}
              maxLength={500}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Imagem do Projeto</Text>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={selecionarImagem}
            >
              <Text style={styles.imageButtonText}>
                {imagem ? "Alterar Imagem" : "Selecionar Imagem"}
              </Text>
            </TouchableOpacity>
            {imagem && (
              <Image source={{ uri: imagem }} style={styles.imagePreview} />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Projeto Público</Text>
            <View style={styles.switchContainer}>
              <Switch
                value={projeto.isPublic}
                onValueChange={(value) =>
                  setProjeto({ ...projeto, isPublic: value })
                }
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={projeto.isPublic ? "#2e7d32" : "#f4f3f4"}
              />
              <Text style={styles.switchLabel}>
                {projeto.isPublic ? "Sim" : "Não"}
              </Text>
            </View>
          </View>

          {renderDatePicker(
            "Data de Início",
            projeto.inicio,
            (date) => handleDateChange("inicio", date),
            new Date()
          )}

          {renderDatePicker(
            "Data de Término",
            projeto.termino,
            (date) => handleDateChange("termino", date),
            projeto.inicio
          )}

          {renderDatePicker(
            "Previsão de Conclusão",
            projeto.previsaoConclusao,
            (date) => handleDateChange("previsaoConclusao", date),
            projeto.inicio
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Responsável (opcional)</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={projeto.responsavel_uuid}
                onValueChange={(itemValue) =>
                  setProjeto({
                    ...projeto,
                    responsavel_uuid: itemValue,
                  })
                }
                style={styles.picker}
              >
                <Picker.Item label="Selecione um responsável" value={null} />
                {usuarios.map((usuario) => (
                  <Picker.Item
                    key={usuario.uuid}
                    label={`${usuario.nome} ${usuario.sobrenome}`}
                    value={usuario.uuid}
                  />
                ))}
              </Picker>
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
              <Text style={styles.saveButtonText}>CRIAR PROJETO</Text>
            )}
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
    color: "#2e7d32",
    textAlign: "center",
    marginVertical: 20,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  picker: {
    height: 50,
  },
  saveButton: {
    backgroundColor: "#2e7d32",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.7,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  switchLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f9f9f9",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
  },
  imageButton: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  imageButtonText: {
    color: "#2e7d32",
    fontSize: 16,
    fontWeight: "500",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
});

export default NewProject;
