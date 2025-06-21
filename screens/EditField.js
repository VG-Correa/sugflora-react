import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import HeaderInterno from "../components/HeaderInterno";
import DatePicker from "../components/DatePicker";
import { useCampoData } from "../data/campos/CampoDataContext";
import { useProjetoData } from "../data/projetos/ProjetoDataContext";
import Campo from "../data/campos/Campo";

const EditField = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { campo } = route.params;
  const { updateCampo } = useCampoData();
  const { getProjetoById } = useProjetoData();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: campo?.id || 0,
    nome: campo?.nome || "",
    descricao: campo?.descricao || "",
    data_inicio: campo?.data_inicio ? new Date(campo.data_inicio) : null,
    data_termino: campo?.data_termino ? new Date(campo.data_termino) : null,
    endereco: campo?.endereco || "",
    cidade: campo?.cidade || "",
    estado: campo?.estado || "",
    pais: campo?.pais || "",
    projeto_id: campo?.projeto_id || 0,
  });

  // Verificar se os dados do campo foram recebidos corretamente
  useEffect(() => {
    if (!campo) {
      Alert.alert("Erro", "Dados do campo não encontrados");
      navigation.goBack();
      return;
    }

    console.log("Dados do campo recebidos:", campo);
  }, [campo, navigation]);

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

      console.log("Iniciando atualização do campo:", formData);

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

      // Criar instância atualizada do Campo
      const campoAtualizado = new Campo(
        formData.id,
        formData.nome.trim(),
        formData.descricao?.trim() || null,
        toISODate(formData.data_inicio),
        formData.data_termino ? toISODate(formData.data_termino) : null,
        formData.endereco.trim(),
        formData.cidade.trim(),
        formData.estado.trim(),
        formData.pais.trim(),
        formData.projeto_id,
        campo.usuario_id, // Manter o mesmo usuário
        campo.created_at, // Manter a data de criação
        new Date().toISOString(), // Atualizar data de modificação
        false
      );

      console.log("Campo atualizado criado:", campoAtualizado);

      const response = updateCampo(campoAtualizado);
      console.log("Resposta da atualização:", response);

      if (response.status === 200) {
        Alert.alert(
          "Sucesso",
          "Campo atualizado com sucesso!",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ],
          { cancelable: false }
        );
      } else {
        throw new Error(response.message || "Erro ao atualizar campo");
      }
    } catch (error) {
      console.error("Erro ao atualizar campo:", error);
      Alert.alert(
        "Erro",
        error.message ||
          "Não foi possível atualizar o campo. Por favor, tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <HeaderInterno />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2e7d32" />
          <Text style={styles.loadingText}>Atualizando campo...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderInterno />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Editar Campo</Text>
        <Text style={styles.subtitle}>Projeto: {campo.projeto?.nome}</Text>

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
            <Text style={styles.buttonText}>Salvar Alterações</Text>
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
    padding: 20,
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
    marginTop: 20,
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
});

export default EditField;
