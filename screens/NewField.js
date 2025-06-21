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
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import HeaderInterno from "../components/HeaderInterno";
import DatePicker from "../components/DatePicker";
import { useCampoData } from "../data/campos/CampoDataContext";
import { useProjetoData } from "../data/projetos/ProjetoDataContext";
import Campo from "../data/campos/Campo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

const NewField = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { projeto } = route.params;
  const { addCampo } = useCampoData();
  const { getProjetoById } = useProjetoData();

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState("inicio");

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    data_inicio: null,
    data_termino: null,
    endereco: "",
    cidade: "",
    estado: "",
    pais: "",
    projeto_id: projeto.id,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toISODate = (date) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validação básica
      if (!formData.nome.trim()) {
        throw new Error("O nome do campo é obrigatório");
      }

      if (!formData.data_inicio) {
        throw new Error("A data de início é obrigatória");
      }

      if (!formData.endereco.trim()) {
        throw new Error("O endereço é obrigatório");
      }

      if (!formData.cidade.trim()) {
        throw new Error("A cidade é obrigatória");
      }

      if (!formData.estado.trim()) {
        throw new Error("O estado é obrigatório");
      }

      if (!formData.pais.trim()) {
        throw new Error("O país é obrigatório");
      }

      // Buscar user_id do AsyncStorage
      const user_id = await AsyncStorage.getItem("user_id");
      if (!user_id) {
        throw new Error("Usuário não identificado");
      }

      // Criar instância do Campo
      const novoCampo = new Campo(
        undefined,
        formData.nome.trim(),
        formData.descricao?.trim() || null,
        toISODate(formData.data_inicio),
        formData.data_termino ? toISODate(formData.data_termino) : null,
        formData.endereco.trim(),
        formData.cidade.trim(),
        formData.estado.trim(),
        formData.pais.trim(),
        formData.projeto_id,
        user_id,
        new Date().toISOString(),
        new Date().toISOString(),
        false
      );

      const response = addCampo(novoCampo);

      if (response.status === 201) {
        Alert.alert(
          "Sucesso",
          "Campo criado com sucesso!",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ],
          { cancelable: false }
        );
      } else {
        throw new Error(response.message || "Erro ao criar campo");
      }
    } catch (error) {
      console.error("Erro ao criar campo:", error);
      Alert.alert(
        "Erro",
        error.message ||
          "Não foi possível criar o campo. Por favor, tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate, mode) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      setShowEndDatePicker(false);
    }

    if (selectedDate) {
      if (mode === "inicio") {
        setFormData((prev) => ({
          ...prev,
          data_inicio: selectedDate.toISOString().split("T")[0],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          data_termino: selectedDate.toISOString().split("T")[0],
        }));
      }
    }
  };

  const renderDatePicker = (label, value, onChange, minDate) => {
    if (Platform.OS === "web") {
      return (
        <View style={styles.fieldGroupHalf}>
          <Text style={styles.fieldLabel}>{label}</Text>
          <input
            type="date"
            value={value ? value.split("T")[0] : ""}
            onChange={(e) => {
              const date = new Date(e.target.value);
              date.setHours(0, 0, 0, 0);
              onChange(date);
            }}
            min={minDate ? minDate.split("T")[0] : undefined}
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
            {value ? value.split("T")[0] : "Selecione uma data"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <HeaderInterno />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2e7d32" />
          <Text style={styles.loadingText}>Criando campo...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderInterno />
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Novo Campo</Text>
          <Text style={styles.subtitle}>Projeto: {projeto.nome}</Text>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Nome do Campo *</Text>
            <TextInput
              style={styles.input}
              value={formData.nome}
              onChangeText={(text) => handleInputChange("nome", text)}
              placeholder="Digite o nome do campo"
            />

            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.descricao}
              onChangeText={(text) => handleInputChange("descricao", text)}
              placeholder="Digite a descrição do campo"
              multiline
              numberOfLines={4}
            />

            <Text style={styles.label}>Data de Início *</Text>
            <DatePicker
              value={formData.data_inicio}
              onChange={(date) => handleInputChange("data_inicio", date)}
              placeholder="Selecione a data de início"
            />

            <Text style={styles.label}>Data de Término</Text>
            <DatePicker
              value={formData.data_termino}
              onChange={(date) => handleInputChange("data_termino", date)}
              placeholder="Selecione a data de término (opcional)"
              minimumDate={formData.data_inicio}
            />

            <Text style={styles.label}>Endereço *</Text>
            <TextInput
              style={styles.input}
              value={formData.endereco}
              onChangeText={(text) => handleInputChange("endereco", text)}
              placeholder="Digite o endereço"
            />

            <Text style={styles.label}>Cidade *</Text>
            <TextInput
              style={styles.input}
              value={formData.cidade}
              onChangeText={(text) => handleInputChange("cidade", text)}
              placeholder="Digite a cidade"
            />

            <Text style={styles.label}>Estado *</Text>
            <TextInput
              style={styles.input}
              value={formData.estado}
              onChangeText={(text) => handleInputChange("estado", text)}
              placeholder="Digite o estado"
            />

            <Text style={styles.label}>País *</Text>
            <TextInput
              style={styles.input}
              value={formData.pais}
              onChangeText={(text) => handleInputChange("pais", text)}
              placeholder="Digite o país"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Criar Campo</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#fff",
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#666",
  },
  submitButton: {
    backgroundColor: "#2e7d32",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 15,
    color: "#2e7d32",
    fontSize: 16,
  },
  fieldGroupHalf: {
    width: "48%",
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
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
  scrollContent: {
    flexGrow: 1,
  },
  scrollContentContainer: {
    padding: 20,
    paddingBottom: 120,
  },
});

export default NewField;
