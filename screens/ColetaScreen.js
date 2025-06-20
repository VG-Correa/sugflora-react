import React, { useState, useEffect } from "react";
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
  Image,
  KeyboardAvoidingView,
  Switch,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import HeaderInterno from "../components/HeaderInterno";
import { useColetaData } from "../data/coletas/ColetaDataContext";
import { useFamiliaData } from "../data/familias/FamiliaDataContext";
import { useGeneroData } from "../data/generos/GeneroDataContext";
import { useEspecieData } from "../data/especies/EspecieDataContext";
import CustomPicker from "../components/CustomPicker";
import ImageSelector from "../components/ImageSelector";
import DatePicker from "../components/DatePicker";

const ColetaScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { coleta, campo, projeto } = route.params;

  const { updateColeta, deleteColeta } = useColetaData();
  const { familias } = useFamiliaData();
  const { generos, getGenerosByFamilia } = useGeneroData();
  const { especies, getEspeciesByGenero } = useEspecieData();

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    data_coleta: null,
    familia_id: null,
    genero_id: null,
    especie_id: null,
    nome_comum: "",
    observacoes: "",
    imagens: [],
    solicita_ajuda_identificacao: false,
  });

  // Determinar se é modo de visualização ou criação
  const isViewMode = !!coleta;

  useEffect(() => {
    if (coleta) {
      // Modo visualização - carregar dados da coleta
      setFormData({
        nome: coleta.nome || "",
        data_coleta: coleta.data_coleta ? new Date(coleta.data_coleta) : null,
        familia_id: coleta.familia_id,
        genero_id: coleta.genero_id,
        especie_id: coleta.especie_id,
        nome_comum: coleta.nome_comum || "",
        observacoes: coleta.observacoes || "",
        imagens: coleta.imagens || [],
        solicita_ajuda_identificacao: coleta.solicita_ajuda_identificacao || false,
      });
    }
  }, [coleta]);

  // Listener para recarregar dados quando a tela voltar ao foco
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (coleta && !isEditing) {
        // Recarregar dados da coleta se necessário
        setFormData({
          nome: coleta.nome || "",
          data_coleta: coleta.data_coleta ? new Date(coleta.data_coleta) : null,
          familia_id: coleta.familia_id,
          genero_id: coleta.genero_id,
          especie_id: coleta.especie_id,
          nome_comum: coleta.nome_comum || "",
          observacoes: coleta.observacoes || "",
          imagens: coleta.imagens || [],
          solicita_ajuda_identificacao: coleta.solicita_ajuda_identificacao || false,
        });
      }
    });

    return unsubscribe;
  }, [navigation, coleta, isEditing]);

  // Carrega gêneros quando família muda
  useEffect(() => {
    const famId = formData.familia_id;
    if (!famId) {
      return;
    }

    try {
      const generosResponse = getGenerosByFamilia(famId);
      if (generosResponse.status !== 200) {
        console.error("Erro ao carregar gêneros:", generosResponse.message);
      }
    } catch (error) {
      console.error("Erro ao carregar gêneros:", error);
    }
  }, [formData.familia_id, getGenerosByFamilia]);

  // Carrega espécies quando gênero muda
  useEffect(() => {
    const genId = formData.genero_id;
    if (!genId) {
      return;
    }

    try {
      const especiesResponse = getEspeciesByGenero(genId);
      if (especiesResponse.status !== 200) {
        console.error("Erro ao carregar espécies:", especiesResponse.message);
      }
    } catch (error) {
      console.error("Erro ao carregar espécies:", error);
    }
  }, [formData.genero_id, getEspeciesByGenero]);

  const handleInputChange = (field, value) => {
    if (isViewMode && !isEditing) return; // Não permitir edição em modo visualização
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDate = (input) => {
    let cleaned = input.replace(/\D/g, "");
    if (cleaned.length > 8) {
      cleaned = cleaned.substring(0, 8);
    }
    let formatted = "";
    for (let i = 0; i < cleaned.length; i++) {
      if (i === 2 || i === 4) {
        formatted += "/";
      }
      formatted += cleaned[i];
    }
    return formatted;
  };

  const handleDateChange = (text) => {
    if (isViewMode && !isEditing) return;
    const formatted = formatDate(text);
    setFormData((prev) => ({ ...prev, data_coleta: formatted }));
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
        throw new Error("O nome da coleta é obrigatório");
      }

      if (!formData.data_coleta) {
        throw new Error("A data da coleta é obrigatória");
      }

      const coletaAtualizada = {
        ...coleta,
        nome: formData.nome.trim(),
        data_coleta: toISODate(formData.data_coleta),
        familia_id: formData.familia_id,
        genero_id: formData.genero_id,
        especie_id: formData.especie_id,
        nome_comum: formData.nome_comum.trim() || null,
        observacoes: formData.observacoes.trim() || null,
        imagens: formData.imagens.length > 0 ? formData.imagens : null,
        identificada: !!formData.especie_id,
        solicita_ajuda_identificacao: formData.solicita_ajuda_identificacao,
        updated_at: new Date().toISOString(),
      };

      const response = await updateColeta(coletaAtualizada);

      if (response.status === 200) {
        Alert.alert(
          "Sucesso",
          "Coleta atualizada com sucesso!",
          [
            {
              text: "OK",
              onPress: () => setIsEditing(false),
            },
          ],
          { cancelable: false }
        );
      } else {
        throw new Error(response.message || "Erro ao atualizar coleta");
      }
    } catch (error) {
      console.error("Erro ao atualizar coleta:", error);
      Alert.alert(
        "Erro",
        error.message ||
          "Não foi possível atualizar a coleta. Por favor, tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Restaurar dados originais
    if (coleta) {
      setFormData({
        nome: coleta.nome || "",
        data_coleta: coleta.data_coleta ? new Date(coleta.data_coleta) : null,
        familia_id: coleta.familia_id,
        genero_id: coleta.genero_id,
        especie_id: coleta.especie_id,
        nome_comum: coleta.nome_comum || "",
        observacoes: coleta.observacoes || "",
        imagens: coleta.imagens || [],
        solicita_ajuda_identificacao: coleta.solicita_ajuda_identificacao || false,
      });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir a coleta "${coleta.nome}"?\n\nEsta ação não pode ser desfeita.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const response = await deleteColeta(coleta.id);

              if (response.status === 200) {
                Alert.alert(
                  "Sucesso",
                  "Coleta excluída com sucesso!",
                  [
                    {
                      text: "OK",
                      onPress: () => navigation.goBack(),
                    },
                  ],
                  { cancelable: false }
                );
              } else {
                throw new Error(response.message || "Erro ao excluir coleta");
              }
            } catch (error) {
              console.error("Erro ao excluir coleta:", error);
              Alert.alert(
                "Erro",
                error.message ||
                  "Não foi possível excluir a coleta. Por favor, tente novamente."
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <HeaderInterno />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2e7d32" />
          <Text style={styles.loadingText}>
            {isViewMode && isEditing
              ? "Atualizando coleta..."
              : "Carregando..."}
          </Text>
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
          <View style={styles.header}>
            <Text style={styles.title}>
              {isViewMode ? "Visualizar Coleta" : "Nova Coleta"}
            </Text>
            {isViewMode && !isEditing && (
              <View style={styles.headerButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={handleEdit}
                >
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDelete}
                >
                  <Text style={styles.deleteButtonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            )}
            {isViewMode && isEditing && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelEdit}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            )}
          </View>

          {campo && <Text style={styles.subtitle}>Campo: {campo.nome}</Text>}
          {projeto && (
            <Text style={styles.subtitle}>Projeto: {projeto.nome}</Text>
          )}

          {isViewMode && !isEditing && (
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                💡 Toque em "Editar" para modificar os dados desta coleta
              </Text>
            </View>
          )}

          <View style={styles.formContainer}>
            <Text style={styles.label}>Nome da Coleta *</Text>
            <TextInput
              style={[
                styles.input,
                isViewMode && !isEditing && styles.disabledInput,
              ]}
              value={formData.nome}
              onChangeText={(text) => handleInputChange("nome", text)}
              placeholder="Digite o nome da coleta"
              editable={!isViewMode || isEditing}
            />

            <Text style={styles.label}>Data da Coleta *</Text>
            <DatePicker
              value={formData.data_coleta}
              onChange={(date) => handleInputChange("data_coleta", date)}
              placeholder="Selecione a data da coleta"
              disabled={isViewMode && !isEditing}
            />

            <Text style={styles.label}>Nome Comum</Text>
            <TextInput
              style={[
                styles.input,
                isViewMode && !isEditing && styles.disabledInput,
              ]}
              value={formData.nome_comum}
              onChangeText={(text) => handleInputChange("nome_comum", text)}
              placeholder="Digite o nome comum"
              editable={!isViewMode || isEditing}
            />

            <Text style={styles.label}>Observações</Text>
            <TextInput
              style={[
                styles.textArea,
                isViewMode && !isEditing && styles.disabledInput,
              ]}
              value={formData.observacoes}
              onChangeText={(text) => handleInputChange("observacoes", text)}
              placeholder="Digite observações sobre a coleta"
              multiline
              numberOfLines={4}
              editable={!isViewMode || isEditing}
            />

            <Text style={styles.label}>Família</Text>
            <CustomPicker
              items={familias.map((f) => ({ id: f.id, label: f.nome }))}
              placeholder="Selecione a família"
              searchable
              value={formData.familia_id}
              onChange={(item) =>
                handleInputChange("familia_id", item?.id || null)
              }
              disabled={isViewMode && !isEditing}
            />

            <Text style={styles.label}>Gênero</Text>
            <CustomPicker
              items={generos.map((g) => ({ id: g.id, label: g.nome }))}
              placeholder="Selecione o gênero"
              searchable
              value={formData.genero_id}
              onChange={(item) =>
                handleInputChange("genero_id", item?.id || null)
              }
              disabled={isViewMode && !isEditing}
            />

            <Text style={styles.label}>Espécie</Text>
            <CustomPicker
              items={especies.map((e) => ({
                id: e.id,
                label: e.nome,
                genero: e.genero,
                familia: e.genero.familia,
              }))}
              placeholder="Selecione a espécie"
              searchable
              value={formData.especie_id}
              onChange={(item) =>
                handleInputChange("especie_id", item?.id || null)
              }
              disabled={isViewMode && !isEditing}
            />

            <Text style={styles.label}>Imagens</Text>
            <ImageSelector
              images={formData.imagens}
              onAddImage={(uri) => {
                if (isViewMode && !isEditing) return;
                setFormData((prev) => ({
                  ...prev,
                  imagens: [...prev.imagens, uri],
                }));
              }}
              onRemoveImage={(uri) => {
                if (isViewMode && !isEditing) return;
                setFormData((prev) => ({
                  ...prev,
                  imagens: prev.imagens.filter((i) => i !== uri),
                }));
              }}
              disabled={isViewMode && !isEditing}
            />

            {/* Campo de solicitação de ajuda */}
            <Text style={styles.label}>Solicitar Ajuda para Identificação</Text>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>
                {formData.solicita_ajuda_identificacao 
                  ? "Sim - Esta coleta solicita ajuda para identificação"
                  : "Não - Esta coleta não solicita ajuda para identificação"
                }
              </Text>
              <Switch
                value={formData.solicita_ajuda_identificacao}
                onValueChange={(value) => 
                  handleInputChange("solicita_ajuda_identificacao", value)
                }
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={formData.solicita_ajuda_identificacao ? "#2e7d32" : "#f4f3f4"}
                disabled={isViewMode && !isEditing}
              />
            </View>

            {isViewMode && isEditing ? (
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.submitButtonText}>Atualizar Coleta</Text>
              </TouchableOpacity>
            ) : null}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e7d32",
    flex: 1,
  },
  editButton: {
    backgroundColor: "#2e7d32",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  formContainer: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 16,
    height: 100,
    textAlignVertical: "top",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#666",
  },
  submitButton: {
    backgroundColor: "#2e7d32",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
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
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  infoContainer: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  infoText: {
    color: "#666",
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
});

export default ColetaScreen;
