import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import CampoApi from "../functions/api/CampoApi";
import HeaderInterno from "../components/HeaderInterno";

const ProjectScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { projeto } = route.params;

  const [campos, setCampos] = useState([]);

  // Função de data simplificada e robusta
  const formatDate = (dateInput) => {
    if (!dateInput) return "Não definida";
    try {
      // Para formatos como '2025-06-12T03:05:59' ou com array [2025, 6, 12, ...]
      let date;
      if (Array.isArray(dateInput)) {
        const [ano, mes, dia] = dateInput;
        // new Date() usa mês 0-11, então subtraímos 1
        date = new Date(ano, mes - 1, dia);
      } else {
        // Para strings, substitui espaço por 'T' para compatibilidade
        date = new Date(String(dateInput).replace(" ", "T"));
      }

      if (isNaN(date.getTime())) return "Data inválida";

      const dia = String(date.getDate()).padStart(2, "0");
      const mes = String(date.getMonth() + 1).padStart(2, "0");
      const ano = date.getFullYear();
      return `${dia}/${mes}/${ano}`;
    } catch (error) {
      return "Data inválida";
    }
  };

  async function fetchCampos() {
    try {
      const response = await CampoApi.getAllByProjetoId(projeto.id);
      if (response.status === 200) {
        setCampos(response.data.data);
      }
    } catch (error) {
      console.log("Erro ao buscar campos:", error);
    }
  }

  useEffect(() => {
    fetchCampos();
  }, []);

  return (
    <View style={styles.container}>
      <HeaderInterno />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.pageTitle}>PROJETO - {projeto.nome.toUpperCase()}</Text>

        {/* Bloco de Informações do Projeto */}
        <View style={styles.infoContainer}>
          <View style={styles.detailsContainer}>
            <View style={styles.topRow}>
              <View style={styles.infoColumn}>
                <Text style={styles.infoLabel}>DATA DE INÍCIO</Text>
                <View style={styles.infoBox}>
                  <Text style={styles.infoValue}>{formatDate(projeto.inicio)}</Text>
                </View>
              </View>
              <View style={styles.infoColumn}>
                <Text style={styles.infoLabel}>PREVISÃO DE CONCLUSÃO</Text>
                <View style={styles.infoBox}>
                  <Text style={styles.infoValue}>{formatDate(projeto.termino)}</Text>
                </View>
              </View>
              <View style={styles.infoColumn}>
                <Text style={styles.infoLabel}>STATUS</Text>
                <View style={[styles.infoBox, { paddingVertical: 0, paddingHorizontal: 0 }]}>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>Ativo</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.fullWidthRow}>
              <Text style={styles.infoLabel}>DESCRIÇÃO</Text>
              <View style={styles.infoBox}>
                <Text style={styles.infoValue}>{projeto.descricao}</Text>
              </View>
            </View>
            <View style={styles.fullWidthRow}>
              <Text style={styles.infoLabel}>RESPONSÁVEL</Text>
              <View style={styles.infoBox}>
                <Text style={styles.infoValue}>{projeto.responsavel}</Text>
              </View>
            </View>
          </View>
          <View style={styles.projectImageContainer}>
            <Image
              source={require('../assets/images/sem-imagem.webp')} // Coloque sua imagem aqui
              style={styles.projectImage}
            />
          </View>
        </View>

        {/* Bloco da Tabela de Campos */}
        <View style={styles.tableContainer}>
          <Text style={styles.sectionTitle}>CAMPOS</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 3 }]}>NOME</Text>
            <Text style={[styles.tableHeaderText, { flex: 1.5, textAlign: 'center' }]}>COLETAS</Text>
            <Text style={[styles.tableHeaderText, { flex: 2, textAlign: 'center' }]}>IDENTIFICADAS</Text>
            <Text style={[styles.tableHeaderText, { flex: 2.5, textAlign: 'center' }]}>NÃO IDENTIFICADAS</Text>
            <Text style={[styles.tableHeaderText, { flex: 1.5, textAlign: 'center' }]}>STATUS</Text>
          </View>
          {campos.map((campo, index) => (
            <View key={index} style={styles.tableRow}>

              {/* CORREÇÃO APLICADA AQUI: O estilo foi movido do <Text> para o <TouchableOpacity> */}
              <TouchableOpacity
                style={[styles.tableCell, { flex: 3 }]} // Estilo da célula aplicado aqui
                onPress={() => navigation.navigate("FieldScreen", { campo: campo })}
              >
                <Text style={styles.linkText}>{campo.nome}</Text>
              </TouchableOpacity>

              {/* Células de dados com alinhamento de texto centralizado para melhor visualização */}
              <Text style={[styles.tableCell, { flex: 1.5, textAlign: 'center' }]}>---</Text>
              <Text style={[styles.tableCell, { flex: 2, textAlign: 'center' }]}>---</Text>
              <Text style={[styles.tableCell, { flex: 2.5, textAlign: 'center' }]}>---</Text>

              {/* Célula de status com alinhamento centralizado */}
              <View style={[styles.tableCell, { flex: 1.5, alignItems: 'center' }]}>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>{campo.deleted ? "Inativo" : "Ativo"}</Text>
                </View>
              </View>

            </View>
          ))}
        </View>

        {/* Botões de Ação */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.addButton]}
            onPress={() => navigation.navigate("NewField", { projeto: projeto })}
          >
            <Text style={styles.buttonText}>Adicionar Campos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => navigation.navigate("EditProject", { projeto: projeto })}
          >
            <Text style={styles.buttonText}>Editar Projeto</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F8F4" },
  content: { flex: 1 },
  scrollContent: { padding: 25 },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 20,
    textAlign: "left",
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  detailsContainer: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoColumn: {
    flex: 1,
    marginRight: 15,
  },
  fullWidthRow: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 12,
    color: '#555',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
  },
  statusBadge: {
    backgroundColor: '#2e7d32',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  projectImageContainer: {
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#333",
    marginBottom: 15,
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    marginBottom: 25,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
    marginBottom: 5,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    color: '#555',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tableCell: {
    color: '#333',
  },
  linkText: {
    color: '#2e7d32',
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#2e7d32',
  },
  editButton: {
    backgroundColor: '#5a9bd5',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ProjectScreen;