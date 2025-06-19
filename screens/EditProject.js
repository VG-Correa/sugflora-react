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
  ActivityIndicator,
  Switch,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import HeaderInterno from "../components/HeaderInterno";
import { useProjetoData } from "../data/projetos/ProjetoDataContext";
import { useUsuarioData } from "../data/usuarios/UsuarioDataContext";

const EditProject = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { projeto } = route.params;
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [imagem, setImagem] = useState(null);
  const { updateProjeto } = useProjetoData();
  const { usuarios: listaUsuarios } = useUsuarioData();
  const [projetoEditado, setProjetoEditado] = useState({
    id: projeto.id,
    nome: projeto.nome,
    descricao: projeto.descricao || "",
    inicio: projeto.inicio,
    termino: projeto.termino || "",
    previsaoConclusao: projeto.previsaoConclusao || "",
    responsavel_uuid: projeto.responsavel_uuid || null,
    imagemBase64: projeto.imagemBase64 || null,
    isPublic: projeto.public || false,
  });

  useEffect(() => {
    carregarUsuarios();
    solicitarPermissaoCamera();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setUsuarios(listaUsuarios);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  };

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
        setProjetoEditado((prev) => ({ ...prev, imagemBase64: base64Image }));
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível selecionar a imagem");
    }
  };

  const formatarData = (data) => {
    if (!data) return "";
    const numeros = data.replace(/\D/g, "");
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 4)
      return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(
      4,
      8
    )}`;
  };

  const handleDataChange = (valor, campo) => {
    const dataFormatada = formatarData(valor);
    setProjetoEditado((prev) => ({ ...prev, [campo]: dataFormatada }));
  };

  const handleSave = async () => {
    try {
      if (!projetoEditado.nome) {
        Alert.alert("Erro", "Por favor, preencha o nome do projeto");
        return;
      }

      if (!projetoEditado.inicio) {
        Alert.alert("Erro", "Por favor, preencha a data de início");
        return;
      }

      setLoading(true);

      const response = updateProjeto({
        ...projetoEditado,
        updated_at: new Date().toISOString(),
      });

      if (response.status === 200) {
        Alert.alert("Sucesso", "Projeto atualizado com sucesso!");
        navigation.reset({
          index: 0,
          routes: [{ name: "MyProjects" }],
        });
      } else {
        throw new Error(response.message || "Erro ao atualizar projeto");
      }
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error);
      Alert.alert(
        "Erro",
        `Não foi possível atualizar o projeto. Erro: ${error.message}`
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
            {value && value.toLocaleDateString
              ? value.toLocaleDateString("pt-BR")
              : "Selecione uma data"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderInterno />
      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>EDITAR PROJETO</Text>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Projeto *</Text>
            <TextInput
              style={styles.input}
              value={projetoEditado.nome}
              onChangeText={(text) =>
                setProjetoEditado((prev) => ({ ...prev, nome: text }))
              }
              placeholder="Digite o nome do projeto"
            />
          </View>

          <View style={styles.inputGroup}>
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data de Início *</Text>
            <TextInput
              style={styles.input}
              value={projetoEditado.inicio}
              onChangeText={(text) => handleDataChange(text, "inicio")}
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data de Término</Text>
            <TextInput
              style={styles.input}
              value={projetoEditado.termino}
              onChangeText={(text) => handleDataChange(text, "termino")}
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Previsão de Conclusão</Text>
            <TextInput
              style={styles.input}
              value={projetoEditado.previsaoConclusao}
              onChangeText={(text) =>
                handleDataChange(text, "previsaoConclusao")
              }
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Responsável</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={projetoEditado.responsavel_uuid}
                onValueChange={(value) =>
                  setProjetoEditado((prev) => ({
                    ...prev,
                    responsavel_uuid: value,
                  }))
                }
                style={styles.picker}
              >
                <Picker.Item label="Selecione um responsável" value={null} />
                {usuarios.map((usuario) => (
                  <Picker.Item
                    key={usuario.id}
                    label={`${usuario.nome} ${usuario.sobrenome}`}
                    value={usuario.id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Projeto Público</Text>
            <View style={styles.switchContainer}>
              <Switch
                value={projetoEditado.isPublic}
                onValueChange={(value) =>
                  setProjetoEditado((prev) => ({ ...prev, isPublic: value }))
                }
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={projetoEditado.isPublic ? "#2e7d32" : "#f4f3f4"}
              />
              <Text style={styles.switchLabel}>
                {projetoEditado.isPublic ? "Sim" : "Não"}
              </Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Imagem do Projeto</Text>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={selecionarImagem}
            >
              <Text style={styles.imageButtonText}>
                {imagem || projetoEditado.imagemBase64
                  ? "Alterar Imagem"
                  : "Selecionar Imagem"}
              </Text>
            </TouchableOpacity>
            {(imagem || projetoEditado.imagemBase64) && (
              <Image
                source={{ uri: imagem || projetoEditado.imagemBase64 }}
                style={styles.imagePreview}
              />
            )}
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
});

export default EditProject;
