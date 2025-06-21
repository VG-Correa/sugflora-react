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

  const formatDate = (date) => {
    if (!date) return "Não definida";
    if (typeof date === "string") {
      return new Date(date).toLocaleDateString("pt-BR");
    }
    return date.toLocaleDateString("pt-BR");
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

  const getStatusColor = () => {
    if (coleta?.identificada) return "#4caf50";
    if (coleta?.solicita_ajuda_identificacao) return "#ff9800";
    return "#f44336";
  };

  const getStatusText = () => {
    if (coleta?.identificada) return "Identificada";
    if (coleta?.solicita_ajuda_identificacao) return "Aguardando Ajuda";
    return "Não Identificada";
  };

  const getFamiliaNome = (familiaId) => {
    if (!familiaId) return "Não definida";
    const familia = familias.find(f => f.id === familiaId);
    return familia ? familia.nome : "Não encontrada";
  };

  const getGeneroNome = (generoId) => {
    if (!generoId) return "Não definido";
    const genero = generos.find(g => g.id === generoId);
    return genero ? genero.nome : "Não encontrado";
  };

  const getEspecieNome = (especieId) => {
    if (!especieId) return "Não definida";
    const especie = especies.find(e => e.id === especieId);
    return especie ? especie.nome : "Não encontrada";
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
          {/* Header com título e botões de ação */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {isViewMode ? "Detalhes da Coleta" : "Nova Coleta"}
            </Text>
            {isViewMode && !isEditing && (
              <View style={styles.headerButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={handleEdit}
                >
                  <Text style={styles.editButtonText}>✏️ Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDelete}
                >
                  <Text style={styles.deleteButtonText}>🗑️ Excluir</Text>
                </TouchableOpacity>
              </View>
            )}
            {isViewMode && isEditing && (
              <View style={styles.headerButtons}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  <Text style={styles.saveButtonText}>💾 Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelEdit}
                >
                  <Text style={styles.cancelButtonText}>❌ Cancelar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Informações do projeto e campo */}
          <View style={styles.contextInfo}>
            {projeto && (
              <View style={styles.contextItem}>
                <Text style={styles.contextLabel}>📋 Projeto:</Text>
                <Text style={styles.contextValue}>{projeto.nome}</Text>
              </View>
            )}
            {campo && (
              <View style={styles.contextItem}>
                <Text style={styles.contextLabel}>📍 Campo:</Text>
                <Text style={styles.contextValue}>{campo.nome}</Text>
              </View>
            )}
          </View>

          {/* Status da coleta */}
          {isViewMode && (
            <View style={styles.statusContainer}>
              <View style={[styles.statusBadge, { backgroundColor: coleta?.identificada ? "#4caf50" : coleta?.solicita_ajuda_identificacao ? "#ff9800" : "#f44336" }]}>
                <Text style={styles.statusText}>
                  {coleta?.identificada ? "Identificada" : coleta?.solicita_ajuda_identificacao ? "Aguardando Ajuda" : "Não Identificada"}
                </Text>
              </View>
            </View>
          )}

          {/* Informações da coleta */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>📝 Informações Básicas</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nome:</Text>
              <Text style={styles.infoValue}>{coleta?.nome || "Não definido"}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Data da Coleta:</Text>
              <Text style={styles.infoValue}>{formatDate(coleta?.data_coleta)}</Text>
            </View>

            {coleta?.nome_comum && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nome Comum:</Text>
                <Text style={styles.infoValue}>{coleta.nome_comum}</Text>
              </View>
            )}

            {coleta?.observacoes && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Observações:</Text>
                <Text style={styles.infoValue}>{coleta.observacoes}</Text>
              </View>
            )}
          </View>

          {/* Classificação taxonômica */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>🌿 Classificação Taxonômica</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Família:</Text>
              <Text style={styles.infoValue}>
                {coleta?.familia_id ? (familias.find(f => f.id === coleta.familia_id)?.nome || "Não encontrada") : "Não definida"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Gênero:</Text>
              <Text style={styles.infoValue}>
                {coleta?.genero_id ? (generos.find(g => g.id === coleta.genero_id)?.nome || "Não encontrado") : "Não definido"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Espécie:</Text>
              <Text style={styles.infoValue}>
                {coleta?.especie_id ? (especies.find(e => e.id === coleta.especie_id)?.nome || "Não encontrada") : "Não definida"}
              </Text>
            </View>
          </View>

          {/* Imagens */}
          {coleta?.imagens && coleta.imagens.length > 0 && (
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>📸 Imagens ({coleta.imagens.length})</Text>
              <View style={styles.imagesContainer}>
                {coleta.imagens.map((imagem, index) => (
                  <Image
                    key={index}
                    source={{ uri: imagem }}
                    style={styles.imageThumbnail}
                    resizeMode="cover"
                  />
                ))}
              </View>
            </View>
          )}

          {/* Solicitação de ajuda */}
          {coleta?.solicita_ajuda_identificacao && (
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>🆘 Solicitação de Ajuda</Text>
              <View style={styles.helpContainer}>
                <Text style={styles.helpText}>
                  Esta coleta solicita ajuda para identificação. 
                  Outros usuários podem ajudar a identificar a espécie.
                </Text>
              </View>
            </View>
          )}

          {/* Formulário de edição */}
          {isViewMode && isEditing && (
            <View style={styles.editSection}>
              <Text style={styles.sectionTitle}>✏️ Editar Coleta</Text>
              
              <View style={styles.formContainer}>
                <Text style={styles.label}>Nome da Coleta *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nome}
                  onChangeText={(text) => handleInputChange("nome", text)}
                  placeholder="Digite o nome da coleta"
                />

                <Text style={styles.label}>Data da Coleta *</Text>
                <DatePicker
                  value={formData.data_coleta}
                  onChange={(date) => handleInputChange("data_coleta", date)}
                  placeholder="Selecione a data da coleta"
                />

                <Text style={styles.label}>Nome Comum</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nome_comum}
                  onChangeText={(text) => handleInputChange("nome_comum", text)}
                  placeholder="Digite o nome comum"
                />

                <Text style={styles.label}>Observações</Text>
                <TextInput
                  style={styles.textArea}
                  value={formData.observacoes}
                  onChangeText={(text) => handleInputChange("observacoes", text)}
                  placeholder="Digite observações sobre a coleta"
                  multiline
                  numberOfLines={4}
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
                />

                <Text style={styles.label}>Imagens</Text>
                <ImageSelector
                  images={formData.imagens}
                  onAddImage={(uri) => {
                    setFormData((prev) => ({
                      ...prev,
                      imagens: [...prev.imagens, uri],
                    }));
                  }}
                  onRemoveImage={(uri) => {
                    setFormData((prev) => ({
                      ...prev,
                      imagens: prev.imagens.filter((i) => i !== uri),
                    }));
                  }}
                />

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
                  />
                </View>
              </View>
            </View>
          )}
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
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2e7d32",
    flex: 1,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  editButton: {
    backgroundColor: "#2e7d32",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: "#f44336",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#4caf50",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: "#ff9800",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  contextInfo: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  contextItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  contextLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2e7d32",
    marginRight: 10,
    minWidth: 80,
  },
  contextValue: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  statusContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  infoSection: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginRight: 15,
    minWidth: 100,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  imageThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  helpContainer: {
    backgroundColor: "#fff3cd",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffeaa7",
  },
  helpText: {
    color: "#856404",
    fontSize: 14,
    lineHeight: 20,
  },
  editSection: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  formContainer: {
    backgroundColor: "#fff",
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

export default ColetaScreen;
