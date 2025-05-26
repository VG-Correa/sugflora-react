import { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import HeaderInterno from "../components/HeaderInterno";
import projetoApi from "../functions/api/projetoApi";

const EditProject = () => {
  const navigation = useNavigation();

  const nomeProjetoRef = useRef();
  const descricaoProjetoRef = useRef();

  async function postProjeto() {
    try {
      const response = await projetoApi.create({
        id: null,
        nome: nomeProjetoRef.current.value,
        descricao: descricaoProjetoRef.current.value,
        usuario_dono_uuid: localStorage.getItem("user_id"),
        public: false,
      });

      if (response.status === 201) {
        navigation.navigate("MyProjects");
      } else {
        window.alert("Erro ao salvar projeto");
      }
    } catch (error) {
      console.log("Erro ao salvar o projeto ", error);
    }
  }

  return (
    <View style={styles.container}>
      <HeaderInterno />
      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>CRIAR PROJETO</Text>

        <View style={styles.profileSection}>
          {/* Seção Foto à esquerda */}
          <View style={styles.photoSection}>
            <Text style={styles.photoLabel}>IMAGEM</Text>
            <View style={styles.photoPlaceholder}></View>
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Adicionar imagem</Text>
            </TouchableOpacity>
          </View>

          {/* Dados do projeto à direita */}
          <View style={styles.dataSection}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>NOME DO PROJETO</Text>
              <TextInput
                ref={nomeProjetoRef}
                style={styles.input}
                placeholder=""
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>DESCRIÇÃO</Text>
              <TextInput
                ref={descricaoProjetoRef}
                style={[styles.input, { height: 100 }]}
                placeholder="Digite aqui"
                multiline
              />
            </View>
          </View>
        </View>

        {/* Seção de datas e responsável */}
        <View style={styles.bottomSection}>
          {/* <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>DATA DE INÍCIO</Text>
            <TextInput
              style={styles.input}
              placeholder="dd/mm/aa"
            />
          </View> */}

          {/* <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>PREVISÃO DE CONCLUSÃO</Text>
            <TextInput
              style={styles.input}
              placeholder="dd/mm/aa"
            />
          </View> */}

          {/* <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>RESPONSÁVEL</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do Responsável"
            />
          </View> */}

          <TouchableOpacity
            style={styles.createButton}
            onPress={() => {
              postProjeto();
            }}
          >
            <Text style={styles.createButtonText}>CRIAR PROJETO</Text>
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
    textAlign: "center",
    marginVertical: 20,
    color: "#2e7d32",
  },
  profileSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  photoSection: {
    width: "30%",
    alignItems: "center",
    marginRight: 20,
  },
  photoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2e7d32",
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: "#e8f5e9",
    marginBottom: 10,
  },
  changePhotoButton: {
    backgroundColor: "#2e7d32",
    padding: 8,
    borderRadius: 5,
  },
  changePhotoText: {
    color: "#fff",
    fontSize: 12,
  },
  dataSection: {
    flex: 1,
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
