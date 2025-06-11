import { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import CampoApi from "../functions/api/CampoApi";
import HeaderInterno from "../components/HeaderInterno";
import DatePicker from "@dietime/react-native-date-picker";
import { format } from "date-fns";

const NewField = () => {
  const navigation = useNavigation();
  const router = useRoute();
  const [loading, setLoading] = useState(false);
  const [dataInicio, setDataInicio] = useState(new Date());

  const { projeto } = router.params;
  const user_id = localStorage.getItem("user_id");

  console.log("Projeto recebido:", projeto);
  console.log("ID do projeto:", projeto?.id);
  console.log("User ID:", user_id);

  const nomeRef = useRef();
  const descricaoRef = useRef();
  const enderecoRef = useRef();
  const cidadeRef = useRef();
  const estadoRef = useRef();
  const paisRef = useRef("Brasil");
  const cepRef = useRef();

  const validarCampos = () => {
    if (!nomeRef.current.value) {
      Alert.alert("Erro", "O nome do campo é obrigatório");
      return false;
    }
    if (!enderecoRef.current.value) {
      Alert.alert("Erro", "O endereço é obrigatório");
      return false;
    }
    if (!cidadeRef.current.value) {
      Alert.alert("Erro", "A cidade é obrigatória");
      return false;
    }
    if (!estadoRef.current.value) {
      Alert.alert("Erro", "O estado é obrigatório");
      return false;
    }
    if (!cepRef.current.value) {
      Alert.alert("Erro", "O CEP é obrigatório");
      return false;
    }
    if (!dataInicio) {
      Alert.alert("Erro", "A data de início é obrigatória");
      return false;
    }
    return true;
  };

  async function salvarCampo() {
    if (!projeto?.id) {
      Alert.alert("Erro", "ID do projeto não encontrado");
      return;
    }

    if (!validarCampos()) {
      return;
    }

    setLoading(true);

    // Formata a data para o formato esperado pelo backend (yyyy-MM-dd)
    const dataFormatada = format(dataInicio, "yyyy-MM-dd");

    const campoJson = {
      id: null,
      usuario_responsavel_uuid: user_id,
      projeto_id: projeto.id,
      nome: nomeRef.current.value,
      descricao: descricaoRef.current.value || "",
      endereco: enderecoRef.current.value,
      cidade: cidadeRef.current.value,
      estado: estadoRef.current.value,
      pais: paisRef.current.value,
      cep: cepRef.current.value,
      data_inicio: dataFormatada,
    };

    console.log("Payload sendo enviado:", campoJson);

    try {
      const response = await CampoApi.create(campoJson);
      if (response.status === 200) {
        Alert.alert("Sucesso", "Campo criado com sucesso");
        console.log("Campo criado com sucesso", response.data.data);
        navigation.navigate("ProjectScreen", { projeto: projeto });
      }
    } catch (error) {
      console.error("Erro completo:", error);

      // Mostra detalhes do erro
      let mensagemErro = "Erro ao criar campo.\n\n";

      if (error.response) {
        // Erro da API
        mensagemErro += `Status: ${error.response.status}\n`;
        mensagemErro += `Mensagem: ${
          error.response.data?.message || "Sem mensagem"
        }\n`;
        if (error.response.data?.data) {
          mensagemErro += `Detalhes: ${JSON.stringify(
            error.response.data.data,
            null,
            2
          )}`;
        }
      } else if (error.request) {
        // Erro de rede
        mensagemErro += "Erro de conexão com o servidor.\n";
        mensagemErro += "Verifique sua conexão com a internet.";
      } else {
        // Outros erros
        mensagemErro += `Erro: ${error.message}`;
      }

      Alert.alert("Erro ao Salvar", mensagemErro, [
        {
          text: "OK",
          onPress: () => console.log("Erro confirmado"),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <HeaderInterno />

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <Text style={styles.pageTitle}>ADICIONAR CAMPO</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>NOME DO CAMPO *</Text>
          <TextInput
            ref={nomeRef}
            style={styles.input}
            placeholder="Nome do campo"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>DESCRIÇÃO</Text>
          <TextInput
            ref={descricaoRef}
            style={[styles.input, { height: 100 }]}
            placeholder="Descrição do campo"
            multiline
          />
        </View>

        <View style={styles.dateSection}>
          <View style={styles.datePickerContainer}>
            <Text style={styles.dataLabel}>Data de início</Text>
            <DatePicker
              value={dataInicio}
              onChange={(value) => setDataInicio(value)}
              format="dd-mm-YY"
              height={300}
              width={300}
              startYear={2025}
              endYear={2030}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>PAÍS</Text>
          <TextInput
            ref={paisRef}
            style={styles.input}
            placeholder="Brasil"
            defaultValue="Brasil"
            editable={false}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>ESTADO *</Text>
          <TextInput
            ref={estadoRef}
            style={styles.input}
            placeholder="Estado"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>CIDADE *</Text>
          <TextInput
            ref={cidadeRef}
            style={styles.input}
            placeholder="Cidade"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>ENDEREÇO *</Text>
          <TextInput
            ref={enderecoRef}
            style={styles.input}
            placeholder="Logradouro, número"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>CEP *</Text>
          <TextInput ref={cepRef} style={styles.input} placeholder="CEP" />
        </View>

        <TouchableOpacity
          style={[styles.createButton, loading && styles.createButtonDisabled]}
          onPress={salvarCampo}
          disabled={loading}
        >
          <Text style={styles.createButtonText}>
            {loading ? "SALVANDO..." : "SALVAR CAMPO"}
          </Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#2e7d32",
  },
  fieldGroup: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#2e7d32",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  createButton: {
    backgroundColor: "#2e7d32",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  createButtonDisabled: {
    backgroundColor: "#a5d6a7",
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  dateSection: {
    marginTop: 20,
  },
  datePickerContainer: {
    marginBottom: 30,
  },
  dataLabel: {
    alignSelf: "center",
    fontSize: 30,
    marginBottom: 10,
  },
});

export default NewField;
