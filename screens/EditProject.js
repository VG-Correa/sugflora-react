import { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import HeaderInterno from "../components/HeaderInterno";
import projetoApi from "../functions/api/projetoApi";
import DatePicker from "@dietime/react-native-date-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditProject = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { projeto } = route.params;

  const [data_inicio, setData_inicio] = useState(() => {
    try {
      if (!projeto.inicio) return new Date();
      const [dataPart, horaPart] = projeto.inicio.split(" ");
      const [ano, mes, dia] = dataPart.split("-");
      const [hora, minuto, segundo] = horaPart.split(":");
      return new Date(ano, mes - 1, dia, hora, minuto, segundo);
    } catch (error) {
      console.error("Erro ao inicializar data de início:", error);
      return new Date();
    }
  });

  const [data_previsao, setData_previsao] = useState(() => {
    try {
      if (!projeto.previsaoConclusao) return new Date();
      const [dataPart, horaPart] = projeto.previsaoConclusao.split(" ");
      const [ano, mes, dia] = dataPart.split("-");
      const [hora, minuto, segundo] = horaPart.split(":");
      return new Date(ano, mes - 1, dia, hora, minuto, segundo);
    } catch (error) {
      console.error("Erro ao inicializar data de previsão:", error);
      return new Date();
    }
  });

  const nomeProjetoRef = useRef();
  const descricaoProjetoRef = useRef();

  async function postEditProjeto() {
    console.log("Projeto: ", projeto);
    try {
      const response = await projetoApi.update({
        id: projeto.id,
        nome: nomeProjetoRef.current.value,
        descricao: descricaoProjetoRef.current.value,
        inicio: data_inicio.toISOString(),
        previsaoConclusao: data_previsao.toISOString(),
        usuario_dono_uuid: localStorage.getItem("user_id"),
        public: projeto.public,
      });

      if (response.status === 200) {
        console.log("Response: ", response.data.data);
        navigation.navigate("ProjectScreen", {
          projeto: response.data.data[0],
        });
      } else {
        window.alert("Erro ao salvar projeto");
      }
    } catch (error) {
      window.alert(
        "Erro ao tentar salvar projeto: " + error.response?.data?.message
      );
      console.log("Erro ao salvar o projeto ", error);
    }
  }

  return (
    <View style={styles.container}>
      <HeaderInterno />
      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>EDITAR PROJETO</Text>

        <View style={styles.profileSection}>
          <View style={styles.dataSection}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>NOME DO PROJETO</Text>
              <TextInput
                ref={nomeProjetoRef}
                style={styles.input}
                placeholder=""
                defaultValue={projeto.nome}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>DESCRIÇÃO</Text>
              <TextInput
                ref={descricaoProjetoRef}
                style={[styles.input, { height: 100 }]}
                placeholder="Digite aqui"
                multiline
                defaultValue={projeto.descricao}
              />
            </View>

            <View style={styles.dateSection}>
              <View style={styles.datePickerContainer}>
                <Text style={styles.dataLabel}>Data de início</Text>
                <DatePicker
                  value={data_inicio}
                  onChange={(value) => setData_inicio(value)}
                  format="dd-mm-YY"
                  height={300}
                  width={300}
                  startYear={2025}
                  endYear={2030}
                />
              </View>

              <View style={styles.datePickerContainer}>
                <Text style={styles.dataLabel}>Previsão de conclusão</Text>
                <DatePicker
                  value={data_previsao}
                  onChange={(value) => setData_previsao(value)}
                  format="dd-mm-YY"
                  height={300}
                  width={300}
                  startYear={2025}
                  endYear={2030}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => {
              postEditProjeto();
            }}
          >
            <Text style={styles.createButtonText}>SALVAR EDIÇÃO</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  dataLabel: {
    alignSelf: "center",
    fontSize: 30,
    marginBottom: 10,
  },
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
    textAlign: "center",
    marginVertical: 20,
    color: "#2e7d32",
  },
  profileSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dataSection: {
    flex: 1,
  },
  dateSection: {
    marginTop: 20,
  },
  datePickerContainer: {
    marginBottom: 30,
  },
  bottomSection: {
    paddingHorizontal: 20,
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
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EditProject;
