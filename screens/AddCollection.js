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
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import HeaderInterno from "../components/HeaderInterno";
import CustomPicker from "../components/CustomPicker";
import ImageSelector from "../components/ImageSelector";
import { useFamiliaData } from "../data/familias/FamiliaDataContext";
import { useGeneroData } from "../data/generos/GeneroDataContext";
import { useEspecieData } from "../data/especies/EspecieDataContext";
import { useColetaData } from "../data/coletas/ColetaDataContext";
import Coleta from "../data/coletas/Coleta";

const { width } = Dimensions.get("window");

export default function AddCollection() {
  const navigation = useNavigation();
  const route = useRoute();
  const { campo } = route.params;

  const [nomeColeta, setNomeColeta] = useState("");
  const [dataColeta, setDataColeta] = useState("");
  const [familia, setFamilia] = useState(null);
  const [genero, setGenero] = useState(null);
  const [especie, setEspecie] = useState(null);
  const [nomeComum, setNomeComum] = useState("");
  const [images, setImages] = useState([]);

  // Usando os contextos de dados
  const { familias } = useFamiliaData();
  const { generos, getGenerosByFamilia } = useGeneroData();
  const { especies, getEspeciesByGenero } = useEspecieData();
  const { addColeta } = useColetaData();

  const toISODate = (ddmmaaaa) => {
    const [dd, mm, yyyy] = ddmmaaaa.split("/");
    return `${yyyy}-${mm}-${dd}`;
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
    if (dataColeta && dataColeta.length !== 10) {
      alert("Por favor, insira uma data válida no formato DD/MM/AAAA");
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
      null, // observacoes
      new Date().toISOString(),
      new Date().toISOString(),
      false
    );

    console.log("Coleta a ser criada:", coleta);
    try {
      const result = addColeta(coleta);
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
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Adicionar Coleta</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome da coleta"
          value={nomeColeta}
          onChangeText={setNomeColeta}
        />

        <TextInput
          style={styles.input}
          placeholder="Data da coleta (DD/MM/AAAA)"
          value={dataColeta}
          onChangeText={handleDateChange}
          keyboardType="numeric"
          maxLength={10} // DD/MM/AAAA tem 10 caracteres
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7" },
  content: { padding: 20, paddingBottom: 40 },
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
});
