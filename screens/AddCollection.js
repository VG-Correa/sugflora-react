import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import HeaderInterno from "../components/HeaderInterno";
import CustomPicker from "../components/CustomPicker";
import ImageSelector from "../components/ImageSelector";
import DatePicker from "../components/DatePicker";
import { useFamiliaData } from "../data/familias/FamiliaDataContext";
import { useGeneroData } from "../data/generos/GeneroDataContext";
import { useEspecieData } from "../data/especies/EspecieDataContext";
import { useColetaData } from "../data/coletas/ColetaDataContext";
import Coleta from "../data/coletas/Coleta";

const { width } = Dimensions.get("window");

export default function AddCollection() {
  const navigation = useNavigation();
  const route = useRoute();
  const { campo, projeto } = route.params || {};

  const [nomeColeta, setNomeColeta] = useState("");
  const [dataColeta, setDataColeta] = useState(null);
  const [familia, setFamilia] = useState(null);
  const [genero, setGenero] = useState(null);
  const [especie, setEspecie] = useState(null);
  const [nomeComum, setNomeComum] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [images, setImages] = useState([]);
  const [solicitaAjuda, setSolicitaAjuda] = useState(false);

  // Usando os contextos de dados
  const { familias } = useFamiliaData();
  const { generos, getGenerosByFamilia } = useGeneroData();
  const { especies, getEspeciesByGenero } = useEspecieData();
  const { addColeta } = useColetaData();

  const toISODate = (date) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  // Função para formatar a data enquanto o usuário digita
  const formatDate = (input) => {
    // Remove tudo que não é dígito
    let cleaned = input.replace(/\D/g, "");

    // Limita o tamanho máximo
    if (cleaned.length > 8) {
      cleaned = cleaned.substring(0, 8);
    }

    // Aplica a formatação
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
    const formatted = formatDate(text);
    setDataColeta(formatted);
  };

  // Carrega gêneros quando família muda
  useEffect(() => {
    const famId = familia?.id;
    if (!famId) {
      setGenero(null);
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
  }, [familia?.id, getGenerosByFamilia]);

  // Carrega espécies quando gênero muda
  useEffect(() => {
    const genId = genero?.id;
    if (!genId) {
      setEspecie(null);
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
  }, [genero?.id, getEspeciesByGenero]);

  // Sincroniza família e gênero quando espécie é alterada
  useEffect(() => {
    if (!especie) return;

    if (especie.genero?.id !== genero?.id) {
      setGenero(especie.genero);
    }

    if (especie.genero?.familia?.id !== familia?.id) {
      setFamilia(especie.genero.familia);
    }
  }, [especie]);

  const handleEspecieSelect = (item) => {
    setEspecie(item);
  };

  const saveCollection = async () => {
    // Valida a data antes de enviar
    if (!dataColeta) {
      alert("Por favor, selecione uma data para a coleta");
      return;
    }

    const coleta = new Coleta(
      null,
      nomeColeta,
      campo.id,
      toISODate(dataColeta),
      familia?.id,
      genero?.id,
      especie?.id,
      nomeComum,
      !!especie?.id, // identificada se tem espécie
      images.length > 0 ? images : null,
      observacoes,
      solicitaAjuda,
      new Date().toISOString(),
      new Date().toISOString(),
      false
    );

    console.log("Coleta a ser criada:", coleta);
    try {
      const result = await addColeta(coleta);
      if (result.status === 201) {
        alert("Coleta criada com sucesso!");
        navigation.goBack();
      } else {
        alert("Erro ao criar coleta: " + result.message);
      }
    } catch (error) {
      console.error("Erro ao criar coleta:", error);
      alert("Erro ao criar coleta");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderInterno />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Adicionar Coleta</Text>

          {/* Informações do Projeto e Campo */}
          {(projeto || campo) && (
            <View style={styles.infoContainer}>
              {projeto && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Projeto:</Text>
                  <Text style={styles.infoValue}>{projeto.nome}</Text>
                </View>
              )}
              {campo && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Campo:</Text>
                  <Text style={styles.infoValue}>{campo.nome}</Text>
                </View>
              )}
            </View>
          )}

          <TextInput
            style={styles.input}
            placeholder="Nome da coleta"
            value={nomeColeta}
            onChangeText={setNomeColeta}
          />

          <DatePicker
            style={styles.input}
            placeholder="Data da coleta"
            value={dataColeta}
            onChange={setDataColeta}
          />

          <TextInput
            style={styles.input}
            placeholder="Nome comum (opcional)"
            value={nomeComum}
            onChangeText={setNomeComum}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Observações (opcional)"
            value={observacoes}
            onChangeText={setObservacoes}
            multiline
            numberOfLines={4}
          />

          <CustomPicker
            items={familias.map((f) => ({ id: f.id, label: f.nome }))}
            placeholder="Selecione a família"
            searchable
            value={familia?.id}
            onChange={setFamilia}
          />

          <CustomPicker
            items={generos.map((g) => ({ id: g.id, label: g.nome }))}
            placeholder="Selecione o gênero"
            searchable
            value={genero?.id}
            onChange={setGenero}
          />

          <CustomPicker
            items={especies.map((e) => ({
              id: e.id,
              label: e.nome,
              genero: e.genero,
              familia: e.genero.familia,
            }))}
            placeholder="Selecione a espécie"
            searchable
            value={especie?.id}
            onChange={handleEspecieSelect}
          />

          <ImageSelector
            images={images}
            onAddImage={(uri) => setImages((prev) => [...prev, uri])}
            onRemoveImage={(uri) =>
              setImages((prev) => prev.filter((i) => i !== uri))
            }
          />

          {/* Campo de solicitação de ajuda */}
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>
              Solicitar ajuda para identificação
            </Text>
            <Switch
              value={solicitaAjuda}
              onValueChange={setSolicitaAjuda}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={solicitaAjuda ? "#2e7d32" : "#f4f3f4"}
            />
          </View>

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={async () => {
                await saveCollection();
              }}
            >
              <Text style={[styles.btnText, { color: "#fff" }]}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7" },
  keyboardAvoidingView: { flex: 1 },
  content: {
    padding: 20,
    paddingBottom: 100,
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  saveBtn: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: { fontSize: 16, fontWeight: "500", color: "#333" },
  infoContainer: {
    backgroundColor: "#e8f5e9",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#2e7d32",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
    marginRight: 10,
    minWidth: 80,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 10,
  },
});
