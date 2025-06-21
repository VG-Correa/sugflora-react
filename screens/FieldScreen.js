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
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import HeaderInterno from "../components/HeaderInterno";
import { useProjetoData } from "../data/projetos/ProjetoDataContext";
import { useCampoData } from "../data/campos/CampoDataContext";
import { useColetaData } from "../data/coletas/ColetaDataContext";
import DateTimePicker from "@react-native-community/datetimepicker";

const FieldScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { campo, projeto } = route.params;
  const { addCampo } = useProjetoData();
  const { updateCampo, deleteCampo } = useCampoData();
  const { getColetasByCampoId } = useColetaData();

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState("inicio");
  const [isEditing, setIsEditing] = useState(false);
  const [coletas, setColetas] = useState([]);
  const [loadingColetas, setLoadingColetas] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    data_inicio: "",
    data_termino: "",
    endereco: "",
    cidade: "",
    estado: "",
    pais: "",
    projeto_id: projeto?.id || campo?.projeto_id,
  });

  // Determinar se é modo de visualização ou criação
  const isViewMode = !!campo;

  useEffect(() => {
    if (campo) {
      // Modo visualização - carregar dados do campo
      setFormData({
        nome: campo.nome || "",
        descricao: campo.descricao || "",
        data_inicio: campo.data_inicio || "",
        data_termino: campo.data_termino || "",
        endereco: campo.endereco || "",
        cidade: campo.cidade || "",
        estado: campo.estado || "",
        pais: campo.pais || "",
        projeto_id: campo.projeto_id,
      });

      // Carregar coletas do campo
      carregarColetas();
    }
  }, [campo]);

  // Listener para recarregar coletas quando a tela voltar ao foco
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (campo && !isEditing) {
        carregarColetas();
      }
    });

    return unsubscribe;
  }, [navigation, campo, isEditing]);

  const carregarColetas = async () => {
    if (!campo?.id) return;

    try {
      setLoadingColetas(true);
      const response = getColetasByCampoId(campo.id);

      if (response.status === 200 && response.data) {
        setColetas(response.data);
      } else {
        console.log("Nenhuma coleta encontrada ou erro ao carregar");
        setColetas([]);
      }
    } catch (error) {
      console.error("Erro ao carregar coletas:", error);
      setColetas([]);
    } finally {
      setLoadingColetas(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (isViewMode && !isEditing) return; // Não permitir edição em modo visualização
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validação básica
      if (!formData.nome.trim()) {
        throw new Error("O nome do campo é obrigatório");
      }

      if (!formData.data_inicio.trim()) {
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

      let response;
      if (isViewMode && isEditing) {
        // Atualizar campo existente
        const campoAtualizado = {
          ...campo,
          ...formData,
          id: campo.id,
          updated_at: new Date().toISOString(),
        };
        response = await updateCampo(campoAtualizado);
      } else {
        // Criar novo campo
        response = await addCampo(formData);
      }

      if (response.status === 201 || response.status === 200) {
        Alert.alert(
          "Sucesso",
          isViewMode && isEditing
            ? "Campo atualizado com sucesso!"
            : "Campo criado com sucesso!",
          [
            {
              text: "OK",
              onPress: () => {
                if (isViewMode && isEditing) {
                  setIsEditing(false);
                } else {
                  navigation.goBack();
                }
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        throw new Error("Erro ao processar campo");
      }
    } catch (error) {
      console.error("Erro ao processar campo:", error);
      Alert.alert(
        "Erro",
        error.message ||
          "Não foi possível processar o campo. Por favor, tente novamente."
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
    if (campo) {
      setFormData({
        nome: campo.nome || "",
        descricao: campo.descricao || "",
        data_inicio: campo.data_inicio || "",
        data_termino: campo.data_termino || "",
        endereco: campo.endereco || "",
        cidade: campo.cidade || "",
        estado: campo.estado || "",
        pais: campo.pais || "",
        projeto_id: campo.projeto_id,
      });
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir o campo "${campo.nome}"?\n\nEsta ação não pode ser desfeita.`,
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
              const response = await deleteCampo(campo.id);

              if (response.status === 200) {
                Alert.alert(
                  "Sucesso",
                  "Campo excluído com sucesso!",
                  [
                    {
                      text: "OK",
                      onPress: () => navigation.goBack(),
                    },
                  ],
                  { cancelable: false }
                );
              } else {
                throw new Error(response.message || "Erro ao excluir campo");
              }
            } catch (error) {
              console.error("Erro ao excluir campo:", error);
              Alert.alert(
                "Erro",
                error.message ||
                  "Não foi possível excluir o campo. Por favor, tente novamente."
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
            disabled={isViewMode && !isEditing}
            style={{
              height: 45,
              borderWidth: 1,
              borderColor: "#E0E0E0",
              borderRadius: 8,
              padding: 10,
              fontSize: 14,
              backgroundColor: isViewMode && !isEditing ? "#f5f5f5" : "#fff",
            }}
          />
        </View>
      );
    }

    return (
      <View style={styles.fieldGroupHalf}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TouchableOpacity
          style={[
            styles.dateButton,
            isViewMode && !isEditing && styles.disabledInput,
          ]}
          onPress={() => {
            if (isViewMode && !isEditing) return;
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
          <Text style={styles.loadingText}>
            {isViewMode && isEditing
              ? "Atualizando campo..."
              : "Criando campo..."}
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
              {isViewMode ? "Visualizar Campo" : "Novo Campo"}
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

          {projeto && (
            <Text style={styles.subtitle}>Projeto: {projeto.nome}</Text>
          )}

          <View style={styles.formContainer}>
            <Text style={styles.label}>Nome do Campo *</Text>
            <TextInput
              style={[
                styles.input,
                isViewMode && !isEditing && styles.disabledInput,
              ]}
              value={formData.nome}
              onChangeText={(text) => handleInputChange("nome", text)}
              placeholder="Digite o nome do campo"
              editable={!isViewMode || isEditing}
            />

            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[
                styles.textArea,
                isViewMode && !isEditing && styles.disabledInput,
              ]}
              value={formData.descricao}
              onChangeText={(text) => handleInputChange("descricao", text)}
              placeholder="Digite a descrição do campo"
              multiline
              numberOfLines={4}
              editable={!isViewMode || isEditing}
            />

            <View style={styles.fieldGroup}>
              {renderDatePicker(
                "DATA DE INÍCIO",
                formData.data_inicio,
                (date) => handleDateChange(null, date, "inicio")
              )}
              {renderDatePicker(
                "DATA DE TÉRMINO",
                formData.data_termino,
                (date) => handleDateChange(null, date, "termino"),
                formData.data_inicio
              )}
            </View>

            <Text style={styles.label}>Endereço *</Text>
            <TextInput
              style={[
                styles.input,
                isViewMode && !isEditing && styles.disabledInput,
              ]}
              value={formData.endereco}
              onChangeText={(text) => handleInputChange("endereco", text)}
              placeholder="Digite o endereço do campo"
              editable={!isViewMode || isEditing}
            />

            <View style={styles.fieldGroup}>
              <View style={styles.fieldGroupHalf}>
                <Text style={styles.fieldLabel}>Cidade *</Text>
                <TextInput
                  style={[
                    styles.input,
                    isViewMode && !isEditing && styles.disabledInput,
                  ]}
                  value={formData.cidade}
                  onChangeText={(text) => handleInputChange("cidade", text)}
                  placeholder="Digite a cidade"
                  editable={!isViewMode || isEditing}
                />
              </View>
              <View style={styles.fieldGroupHalf}>
                <Text style={styles.fieldLabel}>Estado *</Text>
                <TextInput
                  style={[
                    styles.input,
                    isViewMode && !isEditing && styles.disabledInput,
                  ]}
                  value={formData.estado}
                  onChangeText={(text) => handleInputChange("estado", text)}
                  placeholder="Digite o estado"
                  editable={!isViewMode || isEditing}
                />
              </View>
            </View>

            <Text style={styles.label}>País *</Text>
            <TextInput
              style={[
                styles.input,
                isViewMode && !isEditing && styles.disabledInput,
              ]}
              value={formData.pais}
              onChangeText={(text) => handleInputChange("pais", text)}
              placeholder="Digite o país"
              editable={!isViewMode || isEditing}
            />

            {(isViewMode && isEditing) || !isViewMode ? (
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.submitButtonText}>
                  {isViewMode && isEditing ? "Atualizar Campo" : "Criar Campo"}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Seção de Coletas - Apenas em modo visualização */}
          {isViewMode && !isEditing && (
            <View style={styles.coletasContainer}>
              <View style={styles.coletasHeader}>
                <Text style={styles.coletasTitle}>COLETAS DO CAMPO</Text>
                <TouchableOpacity
                  style={styles.addColetaButton}
                  onPress={() =>
                    navigation.navigate("AddCollection", {
                      campo: campo,
                      projeto: projeto,
                    })
                  }
                >
                  <Text style={styles.addColetaButtonText}>+ Nova Coleta</Text>
                </TouchableOpacity>
              </View>

              {loadingColetas ? (
                <View style={styles.loadingColetasContainer}>
                  <ActivityIndicator size="small" color="#2e7d32" />
                  <Text style={styles.loadingColetasText}>
                    Carregando coletas...
                  </Text>
                </View>
              ) : coletas.length === 0 ? (
                <View style={styles.emptyColetasContainer}>
                  <View style={styles.emptyColetasIconContainer}>
                    <Text style={styles.emptyColetasIcon}>🌿</Text>
                  </View>
                  <Text style={styles.emptyColetasTitle}>
                    Nenhuma coleta encontrada
                  </Text>
                  <Text style={styles.emptyColetasText}>
                    Este campo ainda não possui coletas registradas. Comece
                    adicionando sua primeira coleta!
                  </Text>
                  <TouchableOpacity
                    style={styles.addFirstColetaButton}
                    onPress={() =>
                      navigation.navigate("AddCollection", {
                        campo: campo,
                        projeto: projeto,
                      })
                    }
                  >
                    <Text style={styles.addFirstColetaButtonText}>
                      ✨ Adicionar primeira coleta
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.coletasList}>
                  {coletas.map((coleta, index) => (
                    <TouchableOpacity
                      key={coleta.id}
                      style={styles.coletaCard}
                      onPress={() =>
                        navigation.navigate("ColetaScreen", {
                          coleta: coleta,
                          campo: campo,
                          projeto: projeto,
                        })
                      }
                      activeOpacity={0.7}
                    >
                      <View style={styles.coletaHeader}>
                        <Text style={styles.coletaNumber}>
                          Coleta #{index + 1}
                        </Text>
                        <View style={styles.coletaHeaderRight}>
                          <View
                            style={[
                              styles.coletaStatus,
                              {
                                backgroundColor: coleta.especie_id
                                  ? "#4caf50"
                                  : "#ff9800",
                              },
                            ]}
                          >
                            <Text style={styles.coletaStatusText}>
                              {coleta.especie_id
                                ? "Identificada"
                                : "Não identificada"}
                            </Text>
                          </View>
                          <Text style={styles.coletaArrow}>›</Text>
                        </View>
                      </View>

                      <View style={styles.coletaContent}>
                        {coleta.imagens && coleta.imagens.length > 0 && (
                          <Image
                            source={{ uri: coleta.imagens[0] }}
                            style={styles.coletaImage}
                          />
                        )}

                        <View style={styles.coletaInfo}>
                          <Text style={styles.coletaLabel}>Nome:</Text>
                          <Text style={styles.coletaValue}>{coleta.nome}</Text>

                          <Text style={styles.coletaLabel}>
                            Data da Coleta:
                          </Text>
                          <Text style={styles.coletaValue}>
                            {coleta.data_coleta
                              ? new Date(coleta.data_coleta).toLocaleDateString(
                                  "pt-BR"
                                )
                              : "Não informada"}
                          </Text>

                          {coleta.nome_comum && (
                            <>
                              <Text style={styles.coletaLabel}>
                                Nome Comum:
                              </Text>
                              <Text style={styles.coletaValue}>
                                {coleta.nome_comum}
                              </Text>
                            </>
                          )}

                          {coleta.especie_id && (
                            <>
                              <Text style={styles.coletaLabel}>Espécie:</Text>
                              <Text style={styles.coletaValue}>
                                Espécie identificada
                              </Text>
                            </>
                          )}

                          {coleta.observacoes && (
                            <>
                              <Text style={styles.coletaLabel}>
                                Observações:
                              </Text>
                              <Text
                                style={styles.coletaValue}
                                numberOfLines={2}
                              >
                                {coleta.observacoes}
                              </Text>
                            </>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {(showDatePicker || showEndDatePicker) && (
        <DateTimePicker
          value={
            new Date(
              datePickerMode === "inicio"
                ? formData.data_inicio || new Date()
                : formData.data_termino || new Date()
            )
          }
          mode="date"
          display="default"
          onChange={(event, selectedDate) =>
            handleDateChange(event, selectedDate, datePickerMode)
          }
        />
      )}
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
    marginBottom: 20,
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
  fieldLabel: {
    fontSize: 14,
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
  fieldGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  fieldGroupHalf: {
    flex: 1,
    marginRight: 10,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    height: 50,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
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
  coletasContainer: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  coletasHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  coletasTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  addColetaButton: {
    backgroundColor: "#2e7d32",
    padding: 10,
    borderRadius: 5,
  },
  addColetaButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingColetasContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  loadingColetasText: {
    marginLeft: 10,
    color: "#2e7d32",
    fontSize: 16,
  },
  emptyColetasContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyColetasIconContainer: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 50,
    padding: 10,
  },
  emptyColetasIcon: {
    fontSize: 40,
    color: "#2e7d32",
  },
  emptyColetasTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
    marginTop: 10,
  },
  emptyColetasText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  addFirstColetaButton: {
    backgroundColor: "#2e7d32",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  addFirstColetaButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  coletasList: {
    marginTop: 10,
  },
  coletaCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coletaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  coletaNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  coletaHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  coletaStatus: {
    padding: 5,
    borderRadius: 5,
  },
  coletaStatusText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  coletaArrow: {
    fontSize: 14,
    color: "#2e7d32",
    marginLeft: 5,
  },
  coletaContent: {
    flexDirection: "row",
  },
  coletaImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  coletaInfo: {
    flex: 1,
  },
  coletaLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  coletaValue: {
    fontSize: 16,
    color: "#666",
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
});

export default FieldScreen;
