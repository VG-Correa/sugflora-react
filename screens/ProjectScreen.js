import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import CampoApi from '../functions/api/CampoApi';
import HeaderInterno from "../components/HeaderInterno";

const ProjectScreen = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;
  const isMobile = screenWidth < 768;
  const route = useRoute();
  const { projeto } = route.params;

  const [campos, setCampos] = useState([])

  async function fetchCampos() {
    try {

      const response = await CampoApi.getAllByProjetoId(projeto.id)
      console.log("Response Campos: ", response)
      if (response.status === 200) {
        setCampos(response.data.data)
        console.log("Sucesso")
      }
    } catch (error) {
      console.log("Erro ao fazer fetch dos Campos")
    }
  }

  const handleImageError = (error) => {
    console.log('Image loading error:', error);
  };

  const tableColumnSizes = isMobile
    ? { name: 140, others: 80 }
    : { name: 220, others: 120 };

  const handleAddField = () => {
    navigation.navigate('NewField', {projeto: projeto});
  };

  const handleEditProject = () => {
    console.log("Editar projeto clicado");
  };

  async function getColetas(campo) {
    return "Não Implementado"
  }
  async function getColetasIdentificadas(campo) {
    return "Não Implementado"
  }
  async function getColetasNaoIdentificadas(campo) {
    return "Não Implementado"
  }

  useEffect(() => {
    const loadCampos = async () => {await fetchCampos()}
    loadCampos();
  })

  return (
    <View style={styles.container}>
      {/* Header */}
            <HeaderInterno />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>{projeto.nome}</Text>

        {/* Informações do projeto */}
        <View style={styles.box}>
          <View style={[styles.projectInfoContainer, isMobile && styles.mobileProjectInfoContainer]}>
            {/* <View style={[styles.imageContainer, isMobile && styles.mobileImageContainer]}>
              <Image
                source={require('../assets/images/sem-imagem.webp')}
                style={styles.projectImage}
                resizeMode="cover"
                onError={handleImageError}
              />
            </View> */}
            <View style={styles.textContainer}>
              {/* <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>DATA DE INÍCIO:</Text>
                <Text style={styles.detailValue}> 19/01/2023</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>PREVISÃO DE CONCLUSÃO:</Text>
                <Text style={styles.detailValue}> 01/04/2026</Text>
              </View> */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>STATUS:</Text>
                <Text style={styles.detailValue}>{projeto.public ? "Publicado" : "Privado"}</Text>
              </View>
              {/* <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>RESPONSÁVEL:</Text>
                <Text style={styles.detailValue}> Juliana Melo</Text>
              </View> */}
            </View>
          </View>
        </View>

        {/* Descrição */}
        <View style={styles.box}>
          <Text style={styles.sectionTitle}>DESCRIÇÃO</Text>
          <Text style={styles.descriptionText}>
            {projeto.descricao}
          </Text>
        </View>

        {/* Tabela de campos */}
        <View style={[styles.box, styles.tableBox]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { width: tableColumnSizes.name }]}>NOME</Text>
                <Text style={[styles.tableHeaderText, { width: tableColumnSizes.others }]}>COLETAS</Text>
                <Text style={[styles.tableHeaderText, { width: tableColumnSizes.others }]}>IDENTIF.</Text>
                <Text style={[styles.tableHeaderText, { width: tableColumnSizes.others }]}>NÃO ID.</Text>
                <Text style={[styles.tableHeaderText, { width: tableColumnSizes.others }]}>STATUS</Text>
              </View>
              {

                campos.map(campo => {
                  return (
                    <View key={campo.id} style={styles.tableRow}>
                      <TouchableOpacity onPress={() => navigation.navigate('FieldScreen')}>
                        <Text style={[styles.tableCell, { width: tableColumnSizes.name, color: '#2e7d32', fontWeight: 'bold', textDecorationLine: 'underline' }]}>
                          {campo.nome}
                        </Text>
                      </TouchableOpacity>
                      <Text style={[styles.tableCell, { width: tableColumnSizes.others }]}>N/Imp</Text>
                      <Text style={[styles.tableCell, { width: tableColumnSizes.others }]}>N/Imp</Text>
                      <Text style={[styles.tableCell, { width: tableColumnSizes.others }]}>N/Imp</Text>
                      <Text style={[styles.tableCell, { width: tableColumnSizes.others }]}>{campo.deleted ? "Inativo" : "Ativo"}</Text>
                    </View>
                  )
                })

              }

            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* Botões */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.addButton]} onPress={handleAddField}>
          <Text style={styles.buttonText}>ADICIONAR CAMPO</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEditProject}>
          <Text style={styles.buttonText}>EDITAR PROJETO</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleEditProject}>
          <Text style={styles.buttonText}>EXCLUIR PROJETO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1 },
  scrollContent: { padding: 15, paddingBottom: 80 },
  pageTitle: { fontSize: 20, fontWeight: 'bold', color: '#2e7d32', marginBottom: 15, textAlign: 'left' },

  box: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  tableBox: {
    paddingHorizontal: 0,
    paddingVertical: 10,
  },

  projectInfoContainer: { flexDirection: 'row', alignItems: 'flex-start' },
  mobileProjectInfoContainer: { flexDirection: 'column', alignItems: 'flex-start' },
  textContainer: { flex: 1 },
  detailRow: { flexDirection: 'row', marginBottom: 4, alignItems: 'center', flexWrap: 'wrap' },
  detailLabel: { fontWeight: 'bold', color: '#2e7d32', fontSize: 14, textAlign: 'left', marginRight: 5 },
  detailValue: { fontSize: 14, textAlign: 'left' },

  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#2e7d32', marginBottom: 10, textAlign: 'left' },
  descriptionText: { lineHeight: 20, fontSize: 14, textAlign: 'left' },

  tableHeader: { flexDirection: 'row', backgroundColor: '#e8f5e9', paddingVertical: 10, paddingHorizontal: 8 },
  tableHeaderText: { fontWeight: 'bold', textAlign: 'left', fontSize: 14 },
  tableRow: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  tableCell: { textAlign: 'left', fontSize: 14 },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: { backgroundColor: '#2e7d32' },
  editButton: { backgroundColor: '#1565c0' },
  deleteButton: { backgroundColor: 'rgb(255 4 4)' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});

export default ProjectScreen;