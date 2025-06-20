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
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import HeaderInterno from "../components/HeaderInterno";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useProjetoData } from "../data/projetos/ProjetoDataContext";
import { useUsuarioData } from "../data/usuarios/UsuarioDataContext";
import Projeto from "../data/projetos/Projeto";
import DatePicker from "../components/DatePicker";

const NewProject = () => {

  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [imagem, setImagem] = useState(null);
  const { addProjeto, projetos } = useProjetoData();
  const { usuarios } = useUsuarioData();
  const [projeto, setProjeto] = useState(new Projeto());
  
  useEffect(() => {
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
        setProjeto((prev) => ({ ...prev, imagemBase64: base64Image }));
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
    setProjeto((prev) => ({ ...prev, [campo]: dataFormatada }));
  };

  const handleSave = async () => {
    try {
      if (!projeto.nome) {
        Alert.alert("Erro", "Por favor, preencha o nome do projeto");
        return;
      }

      if (!projeto.inicio) {
        Alert.alert("Erro", "Por favor, preencha a data de início");
        return;
      }

      setLoading(true);
      const user_id = await AsyncStorage.getItem("user_id");

      if (!user_id) {
        throw new Error("Usuário não identificado");
      }

      console.log("Usuário ID:", user_id);
      projeto.usuario_dono_id = user_id;
      console.log("Dados do projeto:", projeto);

      const response = addProjeto(projeto);
      console.log("Resposta da API:", response);

      if (response.status === 201) {
        Alert.alert("Sucesso", "Projeto criado com sucesso!");
        console.log("Projeto criado:", response.data);
        console.log("Projetos: ", projetos)
        navigation.reset({
          index: 0,
          routes: [{ name: "MyProjects" }],
        });
      } else {
        throw new Error(response.message || "Erro ao criar projeto");
      }
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      Alert.alert(
        "Erro",
        `Não foi possível criar o projeto. Erro: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Função para sincronizar projetos pendentes
  const sincronizarProjetosPendentes = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const projetosExistentes = await AsyncStorage.getItem("projetos");
      if (!projetosExistentes) return;

      const projetos = JSON.parse(projetosExistentes);
      const projetosPendentes = projetos.filter((p) => p.status === "pendente");

      for (const projeto of projetosPendentes) {
        try {
          const response = await axios.post(
            "http://localhost:8080/api/projeto",
            projeto,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.status === 200) {
            // Atualizar status do projeto
            const projetoAtualizado = {
              ...projeto,
              id: response.data.id,
              status: "sincronizado",
            };

            // Atualizar na lista local
            const projetosAtualizados = projetos.map((p) =>
              p.nome === projeto.nome ? projetoAtualizado : p
            );

            await AsyncStorage.setItem(
              "projetos",
              JSON.stringify(projetosAtualizados)
            );
            console.log(`Projeto ${projeto.nome} sincronizado com sucesso!`);
          }
        } catch (error) {
          console.error(`Erro ao sincronizar projeto ${projeto.nome}:`, error);
        }
      }
    } catch (error) {
      console.error("Erro ao sincronizar projetos:", error);
    }
  };

  // Adicionar useEffect para sincronização periódica
  useEffect(() => {
    const sincronizarPeriodicamente = async () => {
      await sincronizarProjetosPendentes();
    };

    // Sincronizar a cada 5 minutos
    const intervalo = setInterval(sincronizarPeriodicamente, 5 * 60 * 1000);

    // Sincronizar também quando o componente montar
    sincronizarPeriodicamente();

    return () => clearInterval(intervalo);
  }, []);

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
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
        >
          <Text style={styles.pageTitle}>CRIAR PROJETO</Text>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome do Projeto *</Text>
              <TextInput
                style={styles.input}
                value={projeto.nome}
                onChangeText={(text) =>
                  setProjeto((prev) => ({ ...prev, nome: text }))
                }
                placeholder="Digite o nome do projeto"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={projeto.descricao}
                onChangeText={(text) =>
                  setProjeto((prev) => ({ ...prev, descricao: text }))
                }
                placeholder="Digite a descrição do projeto"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data de Início *</Text>
              <Text style={styles.label}>
                {projeto.inicio
                  ? `Data selecionada: ${projeto.inicio.toLocaleDateString()}`
                  : "Nenhuma data selecionada"}
              </Text>
             
              <DatePicker
                value={projeto.inicio}
                onChange={(date) =>
                  setProjeto((prev) => ({ ...prev, inicio: date }))
                }
                placeholder="Selecione a data de início"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data de Término</Text>
              <DatePicker
                value={projeto.termino}
                onChange={(date) =>
                  setProjeto((prev) => ({ ...prev, termino: date }))
                }
                placeholder="Selecione a data de término"
                minimumDate={projeto.inicio}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Previsão de Conclusão</Text>
              <DatePicker
                value={projeto.previsaoConclusao}
                onChange={(date) =>
                  setProjeto((prev) => ({ ...prev, previsaoConclusao: date }))
                }
                placeholder="Selecione a previsão de conclusão"
                minimumDate={projeto.inicio}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Responsável</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={projeto.responsavel_uuid}
                  onValueChange={(value) =>
                    setProjeto((prev) => ({ ...prev, responsavel_id: value }))
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

            {/* <View style={styles.inputGroup}>
              <Text style={styles.label}>Projeto Público</Text>
              <View style={styles.switchContainer}>
                <Switch
                  value={projeto.isPublic}
                  onValueChange={(value) =>
                    setProjeto((prev) => ({ ...prev, isPublic: value }))
                  }
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={projeto.isPublic ? "#2e7d32" : "#f4f3f4"}
                />
                <Text style={styles.switchLabel}>
                  {projeto.isPublic ? "Sim" : "Não"}
                </Text>
              </View>
            </View> */}

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
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 120,
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
    paddingBottom: 40,
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
    marginTop: 30,
    marginBottom: 20,
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
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
  imagePreview: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginTop: 10,
    resizeMode: "cover",
  },
});

export default NewProject;
