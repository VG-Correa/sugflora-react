import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert, // Usamos o Alert nativo do React Native para feedback simples
  ActivityIndicator,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import HeaderInterno from "../components/HeaderInterno";
import * as ImagePicker from "expo-image-picker";
import { useProjetoData } from "../data/projetos/ProjetoDataContext"; // Importa o hook do seu contexto
import Projeto from "../data/projetos/Projeto"; // Importa a classe Projeto

const NewProject = () => {
  const [loading, setLoading] = useState(false);
  const [imagemPreviewUri, setImagemPreviewUri] = useState(null); // Estado para a URI da imagem para preview
  const [projeto, setProjeto] = useState({
    nome: "",
    descricao: "",
    isPublic: false, // Mantido caso você queira reintroduzir o Switch
    inicio: "",
    termino: "",
    // previsaoConclusao: "", // Não usado no construtor de Projeto atualmente, considere remover ou mapear
    responsavel_uuid: null, // Mantido caso você queira reintroduzir o Picker de responsável
    imagemBase64: null,
  });
  const { addProjeto } = useProjetoData(); // Obtém a função addProjeto do seu contexto
  const navigation = useNavigation();

  useEffect(() => {
    // Solicita permissão da galeria de mídia ao carregar o componente
    requestMediaLibraryPermission();
  }, []);

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de permissão para acessar suas fotos para que você possa selecionar uma imagem para o projeto."
      );
    }
  };

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.5,
        base64: true, // Solicita a imagem em base64
      });

      if (!result.canceled) {
        // Formata a imagem base64 para uso em tags <img> ou envio para API
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setImagemPreviewUri(result.assets[0].uri); // Define a URI para mostrar no preview
        setProjeto((prev) => ({ ...prev, imagemBase64: base64Image })); // Armazena o base64 no estado do projeto
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    }
  };

  // Função para formatar a entrada de data (DD/MM/AAAA)
  const formatarDataInput = (data) => {
    if (!data) return "";
    const numeros = data.replace(/\D/g, ""); // Remove caracteres não numéricos
    let formatted = "";
    if (numeros.length > 0) {
      formatted += numeros.substring(0, 2);
    }
    if (numeros.length > 2) {
      formatted += `/${numeros.substring(2, 4)}`;
    }
    if (numeros.length > 4) {
      formatted += `/${numeros.substring(4, 8)}`;
    }
    return formatted;
  };

  // Lida com a mudança no campo de input de data
  const handleDateChange = (valor, campo) => {
    const dataFormatada = formatarDataInput(valor);
    setProjeto((prev) => ({ ...prev, [campo]: dataFormatada }));
  };

  // Função auxiliar para converter "DD/MM/AAAA" para um objeto Date
  const parseDateString = (dateString) => {
    if (!dateString) return null;
    const parts = dateString.split("/");
    // Verifica se temos 3 partes (dia, mês, ano) e se são números
    if (parts.length === 3 && parts.every(part => !isNaN(parseInt(part)))) {
        const [day, month, year] = parts.map(Number);
        const date = new Date(year, month - 1, day); // Mês é baseado em 0 (janeiro = 0)
        // Valida se a data criada é válida
        return isNaN(date.getTime()) ? null : date;
    }
    return null; // Retorna null se o formato for inválido
  };

  const handleSave = async () => {
    try {
      if (!projeto.nome.trim()) {
        Alert.alert("Erro", "Por favor, preencha o nome do projeto.");
        return;
      }

      if (!projeto.inicio.trim()) {
        Alert.alert("Erro", "Por favor, preencha a data de início.");
        return;
      }

      const parsedInicio = parseDateString(projeto.inicio);
      if (!parsedInicio) {
        Alert.alert("Erro", "Formato de Data de Início inválido. Use DD/MM/AAAA.");
        return;
      }

      const parsedTermino = parseDateString(projeto.termino);
      if (projeto.termino && !parsedTermino) {
        Alert.alert("Erro", "Formato de Data de Término inválido. Use DD/MM/AAAA.");
        return;
      }

      setLoading(true); // Ativa o indicador de carregamento

      // Cria uma nova instância da classe Projeto com os dados formatados
      const newProjectInstance = new Projeto(
        0, // ID 0 para novos projetos, assumindo que o ID é gerado no serviço ou backend
        projeto.nome.trim(),
        projeto.descricao?.trim() || "",
        parsedInicio, // Data de início como objeto Date
        parsedTermino, // Data de término como objeto Date ou null
        "pendente", // Status inicial do projeto
        // projeto.responsavel_uuid || null, // Descomente se você reintroduzir o responsável
        null, // Placeholder se responsavel_uuid não for usado
        projeto.imagemBase64 || null
      );

      // Chama a função addProjeto do contexto
      const response = await addProjeto(newProjectInstance);

      // Verifica o status da resposta do contexto (201 para sucesso de criação)
      if (response && response.status === 201) { // <-- AQUI É A MUDANÇA PRINCIPAL (200 para 201)
        Alert.alert("Sucesso", "Projeto criado com sucesso!");
        navigation.navigate("MyProjects"); // Navega de volta para a lista de projetos
      } else {
        // Exibe mensagem de erro se a adição falhar
        Alert.alert(
          "Erro",
          response?.message || "Não foi possível adicionar o projeto. Tente novamente."
        );
      }
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
      Alert.alert(
        "Erro",
        `Não foi possível salvar o projeto. Erro: ${error.message || "Erro desconhecido"}`
      );
    } finally {
      setLoading(false); // Desativa o indicador de carregamento
    }
  };

  return (
    <View style={styles.container}>
      <HeaderInterno />
      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>CRIAR PROJETO</Text>
        <View style={styles.formContainer}>
          {/* Campo Nome do Projeto */}
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

          {/* Campo Descrição */}
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

          {/* Campo Data de Início */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data de Início *</Text>
            <TextInput
              style={styles.input}
              value={projeto.inicio}
              onChangeText={(text) => handleDateChange(text, "inicio")}
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          {/* Campo Data de Término */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data de Término</Text>
            <TextInput
              style={styles.input}
              value={projeto.termino}
              onChangeText={(text) => handleDateChange(text, "termino")}
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          {/* Seções comentadas para "Responsável" e "Projeto Público" - descomente se for usar */}
          {/*
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Responsável</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={projeto.responsavel_uuid}
                onValueChange={(value) =>
                  setProjeto((prev) => ({ ...prev, responsavel_uuid: value }))
                }
                style={styles.picker}
              >
                <Picker.Item label="Selecione um responsável" value={null} />
                {usuarios.map((usuario) => ( // 'usuarios' array precisa ser definido e populado
                  <Picker.Item
                    key={usuario.uuid}
                    label={`${usuario.nome} ${usuario.sobrenome}`}
                    value={usuario.uuid}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
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
          </View>
          */}

          {/* Seleção e Preview de Imagem */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Imagem do Projeto</Text>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={selectImage}
            >
              <Text style={styles.imageButtonText}>
                {imagemPreviewUri ? "Alterar Imagem" : "Selecionar Imagem"}
              </Text>
            </TouchableOpacity>
            {imagemPreviewUri && (
              <Image source={{ uri: imagemPreviewUri }} style={styles.imagePreview} />
            )}
          </View>

          {/* Botão Salvar/Criar Projeto */}
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

export default NewProject;
