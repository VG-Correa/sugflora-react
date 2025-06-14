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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import HeaderInterno from "../components/HeaderInterno";
import projetoApi from "../functions/api/projetoApi";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

const NewProject = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [showInicioPicker, setShowInicioPicker] = useState(false);
  const [showTerminoPicker, setShowTerminoPicker] = useState(false);
  const [showPrevisaoPicker, setShowPrevisaoPicker] = useState(false);
  const [projeto, setProjeto] = useState({
    nome: "",
    descricao: "",
    isPublic: false,
    inicio: new Date(),
    termino: null,
    previsaoConclusao: null,
    responsavel_uuid: null,
  });

  useEffect(() => {
    carregarUsuarios();
  }, []);

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
      switch (tipo) {
        case "inicio":
          setProjeto({ ...projeto, inicio: selectedDate });
          break;
        case "termino":
          setProjeto({ ...projeto, termino: selectedDate });
          break;
        case "previsao":
          setProjeto({ ...projeto, previsaoConclusao: selectedDate });
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
      const uuid = await AsyncStorage.getItem("uuid");

      // Formatar as datas para o formato esperado pela API
      const projetoData = {
        nome: projeto.nome,
        descricao: projeto.descricao || null,
        isPublic: projeto.isPublic,
        usuario_dono_uuid: uuid,
        inicio: projeto.inicio.toISOString(),
        termino: projeto.termino ? projeto.termino.toISOString() : null,
        previsaoConclusao: projeto.previsaoConclusao
          ? projeto.previsaoConclusao.toISOString()
          : null,
        responsavel_uuid: projeto.responsavel_uuid || null,
      };

      console.log("Dados do projeto sendo enviados:", projetoData);

      const response = await projetoApi.create(projetoData);

      if (response.status === 201) {
        Alert.alert("Sucesso", "Projeto criado com sucesso!");
        navigation.navigate("MyProjects");
      } else {
        Alert.alert("Erro", "Não foi possível criar o projeto");
      }
    } catch (error) {
      console.error("Erro detalhado ao salvar projeto:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      let mensagemErro = "Não foi possível salvar o projeto. ";
      if (error.response?.data?.message) {
        mensagemErro += error.response.data.message;
      } else {
        mensagemErro += "Por favor, tente novamente.";
      }

      Alert.alert("Erro", mensagemErro);
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data de Início *</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowInicioPicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {formatarData(projeto.inicio)}
              </Text>
            </TouchableOpacity>
            {showInicioPicker && (
              <DateTimePicker
                value={projeto.inicio}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, date) =>
                  handleDateChange(event, date, "inicio")
                }
                minimumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data de Término (opcional)</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowTerminoPicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {projeto.termino
                  ? formatarData(projeto.termino)
                  : "Selecione uma data"}
              </Text>
            </TouchableOpacity>
            {showTerminoPicker && (
              <DateTimePicker
                value={projeto.termino || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, date) =>
                  handleDateChange(event, date, "termino")
                }
                minimumDate={projeto.inicio}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Previsão de Conclusão (opcional)</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowPrevisaoPicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {projeto.previsaoConclusao
                  ? formatarData(projeto.previsaoConclusao)
                  : "Selecione uma data"}
              </Text>
            </TouchableOpacity>
            {showPrevisaoPicker && (
              <DateTimePicker
                value={projeto.previsaoConclusao || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, date) =>
                  handleDateChange(event, date, "previsao")
                }
                minimumDate={projeto.inicio}
              />
            )}
          </View>

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

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>CRIAR PROJETO</Text>
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
});

export default NewProject;
