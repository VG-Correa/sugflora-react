import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import HeaderInterno from "../components/HeaderInterno";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

const NewField = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { projeto } = route.params;

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState("inicio");

  const [campo, setCampo] = useState({
    nome: "",
    descricao: "",
    pais: "Brasil",
    estado: "",
    cidade: "",
    endereco: "",
    data_inicio: new Date(),
    data_termino: null,
    cep: "",
  });

  const validarCampos = () => {
    if (!campo.nome || !campo.estado || !campo.cidade || !campo.endereco) {
      Alert.alert(
        "Campos obrigatórios",
        "Por favor, preencha todos os campos marcados com *"
      );
      return false;
    }
    return true;
  };

  const handleDateChange = (event, selectedDate, mode) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      setShowEndDatePicker(false);
    }

    if (selectedDate) {
      if (mode === "inicio") {
        setCampo((prev) => ({
          ...prev,
          data_inicio: selectedDate,
        }));
      } else {
        setCampo((prev) => ({
          ...prev,
          data_termino: selectedDate,
        }));
      }
    }
  };

  const handleSubmit = async () => {
    if (!projeto?.id) {
      Alert.alert(
        "Erro",
        "ID do projeto não encontrado. Volte e tente novamente."
      );
      return;
    }

    if (!validarCampos()) {
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("user_id");

      if (!token) {
        throw new Error("Token não encontrado. Faça login novamente.");
      }

      if (!userId) {
        throw new Error("Usuário não identificado");
      }

      const campoData = {
        nome: campo.nome.trim(),
        descricao: campo.descricao?.trim() || "",
        endereco: campo.endereco.trim(),
        cidade: campo.cidade.trim(),
        estado: campo.estado.trim(),
        pais: campo.pais,
        data_inicio: campo.data_inicio.toISOString().split("T")[0],
        data_termino: campo.data_termino
          ? campo.data_termino.toISOString().split("T")[0]
          : null,
        cep: campo.cep.trim(),
        usuario_responsavel_uuid: userId,
        projeto_id: projeto.id,
      };

      console.log("Dados do campo sendo enviados:", campoData);

      const response = await axios.post(
        "http://localhost:8080/api/campo",
        campoData,
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

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Sucesso!", "Novo campo cadastrado com sucesso!", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        throw new Error(response.data?.message || "Erro ao criar campo");
      }
    } catch (error) {
      console.error("Erro ao criar campo:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      Alert.alert(
        "Erro",
        error.response?.data?.message ||
          error.message ||
          "Não foi possível criar o campo. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderDatePicker = (label, value, onChange, minDate) => {
    if (Platform.OS === "web") {
      return (
        <View style={styles.fieldGroupHalf}>
          <Text style={styles.fieldLabel}>{label}</Text>
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
              height: 45,
              borderWidth: 1,
              borderColor: "#E0E0E0",
              borderRadius: 8,
              padding: 10,
              fontSize: 14,
              backgroundColor: "#fff",
            }}
          />
        </View>
      );
    }

    return (
      <View style={styles.fieldGroupHalf}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            setDatePickerMode(
              label === "DATA DE INÍCIO" ? "inicio" : "termino"
            );
            if (label === "DATA DE INÍCIO") {
              setShowDatePicker(true);
            } else {
              setShowEndDatePicker(true);
            }
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
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.formWrapper}
      >
        <Text style={styles.pageTitle}>ADICIONAR CAMPO</Text>

        <View style={styles.row}>
          <View style={styles.fieldGroupHalf}>
            <Text style={styles.fieldLabel}>NOME DO CAMPO *</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={campo.nome}
              onChangeText={(text) =>
                setCampo((prev) => ({ ...prev, nome: text }))
              }
            />
          </View>
          {renderDatePicker(
            "DATA DE INÍCIO *",
            campo.data_inicio,
            (date) => handleDateChange(null, date, "inicio"),
            new Date()
          )}
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>DESCRIÇÃO</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Digite aqui"
            multiline
            value={campo.descricao}
            onChangeText={(text) =>
              setCampo((prev) => ({ ...prev, descricao: text }))
            }
          />
        </View>

        <View style={styles.row}>
          <View style={styles.fieldGroupThird}>
            <Text style={styles.fieldLabel}>PAÍS</Text>
            <TextInput
              style={styles.input}
              value={campo.pais}
              editable={false}
            />
          </View>
          <View style={styles.fieldGroupThird}>
            <Text style={styles.fieldLabel}>ESTADO *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: SP"
              value={campo.estado}
              onChangeText={(text) =>
                setCampo((prev) => ({ ...prev, estado: text }))
              }
            />
          </View>
          <View style={styles.fieldGroupThird}>
            <Text style={styles.fieldLabel}>CIDADE *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: São Paulo"
              value={campo.cidade}
              onChangeText={(text) =>
                setCampo((prev) => ({ ...prev, cidade: text }))
              }
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.fieldGroupHalf}>
            <Text style={styles.fieldLabel}>ENDEREÇO *</Text>
            <TextInput
              style={styles.input}
              placeholder="Rua, número, bairro"
              value={campo.endereco}
              onChangeText={(text) =>
                setCampo((prev) => ({ ...prev, endereco: text }))
              }
            />
          </View>
          {renderDatePicker(
            "PREVISÃO DE CONCLUSÃO",
            campo.data_termino,
            (date) => handleDateChange(null, date, "termino"),
            campo.data_inicio
          )}
        </View>

        {(showDatePicker || showEndDatePicker) && (
          <DateTimePicker
            value={
              datePickerMode === "inicio"
                ? campo.data_inicio
                : campo.data_termino || new Date()
            }
            mode="date"
            display="default"
            onChange={(event, date) =>
              handleDateChange(event, date, datePickerMode)
            }
            minimumDate={
              datePickerMode === "inicio" ? new Date() : campo.data_inicio
            }
          />
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.createButton,
              loading && styles.createButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.createButtonText}>
              {loading ? "SALVANDO..." : "Salvar Campo"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F8F4" },
  content: { flex: 1 },
  formWrapper: { paddingHorizontal: 30, paddingVertical: 20 },
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 30,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  fieldGroup: {
    marginBottom: 15,
  },
  fieldGroupHalf: {
    width: "48%",
  },
  fieldGroupThird: {
    width: "31%",
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    height: 45,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  dateButton: {
    height: 45,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  dateButtonText: {
    fontSize: 14,
    color: "#333",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  createButton: {
    backgroundColor: "#2e7d32",
    paddingVertical: 15,
    borderRadius: 8,
    width: "50%",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  createButtonDisabled: {
    backgroundColor: "#a5d6a7",
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default NewField;
