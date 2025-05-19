import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProjectScreen = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;
  const isMobile = screenWidth < 768;

  const handleImageError = (error) => {
    console.log('Image loading error:', error);
  };

  const tableColumnSizes = isMobile
    ? { name: 140, others: 80 }
    : { name: 220, others: 120 };

  const handleAddField = () => {
    navigation.navigate('NewField');
  };

  const handleEditProject = () => {
    console.log("Editar projeto clicado");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Image 
          source={require('../assets/images/cabecalho.webp')} 

          style={styles.headerBackgroundImage}
          resizeMode="cover"
        />
        <View style={styles.headerContent}>
          <Image 
            source={require('../assets/images/logo.webp')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>SUG - FLORA</Text>
          <View style={styles.menuTop}>
            <Text style={styles.menuText} onPress={() => navigation.navigate('HomePage')}>PÁGINA INICIAL</Text>
            <Text style={styles.menuText}>SOBRE</Text>
            <Text style={styles.menuText}>CONTATO</Text>
            <Text style={styles.menuText}>SAIR</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>PROJETO - ECOBOTÂNICA</Text>

        {/* Informações do projeto */}
        <View style={styles.box}>
          <View style={[styles.projectInfoContainer, isMobile && styles.mobileProjectInfoContainer]}>
            <View style={[styles.imageContainer, isMobile && styles.mobileImageContainer]}>
              <Image
                source={require('../assets/images/sem-imagem.webp')}
                style={styles.projectImage}
                resizeMode="cover"
                onError={handleImageError}
              />
            </View>
            <View style={styles.textContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>DATA DE INÍCIO:</Text>
                <Text style={styles.detailValue}> 19/01/2023</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>PREVISÃO DE CONCLUSÃO:</Text>
                <Text style={styles.detailValue}> 01/04/2026</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>STATUS:</Text>
                <Text style={styles.detailValue}> Ativo</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>RESPONSÁVEL:</Text>
                <Text style={styles.detailValue}> Juliana Melo</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Descrição */}
        <View style={styles.box}>
          <Text style={styles.sectionTitle}>DESCRIÇÃO</Text>
          <Text style={styles.descriptionText}>
            Pesquisa sobre plantas medicinais e nativas do Brasil.
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
              <View style={styles.tableRow}>
                <TouchableOpacity onPress={() => navigation.navigate('FieldScreen')}>
                  <Text style={[styles.tableCell, { width: tableColumnSizes.name, color: '#2e7d32', fontWeight: 'bold', textDecorationLine: 'underline' }]}>
                    CAMPO 1
                  </Text>
                </TouchableOpacity>
                <Text style={[styles.tableCell, { width: tableColumnSizes.others }]}>4</Text>
                <Text style={[styles.tableCell, { width: tableColumnSizes.others }]}>4</Text>
                <Text style={[styles.tableCell, { width: tableColumnSizes.others }]}>0</Text>
                <Text style={[styles.tableCell, { width: tableColumnSizes.others }]}>Ativo</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: tableColumnSizes.name }]}>CAMPO 2</Text>
                <Text style={[styles.tableCell, { width: tableColumnSizes.others }]}>6</Text>
                <Text style={[styles.tableCell, { width: tableColumnSizes.others }]}>5</Text>
                <Text style={[styles.tableCell, { width: tableColumnSizes.others }]}>1</Text>
                <Text style={[styles.tableCell, { width: tableColumnSizes.others }]}>Ativo</Text>
              </View>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerContainer: { height: 220, width: '100%', position: 'relative' },
  headerBackgroundImage: { width: '100%', height: '100%', position: 'absolute' },
  headerContent: { position: 'absolute', width: '100%', alignItems: 'center', paddingTop: 40 },
  logoImage: { width: 80, height: 80 },
  logoText: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 10 },
  menuTop: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 20 },
  menuText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
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
  imageContainer: { marginRight: 15 },
  mobileProjectInfoContainer: { flexDirection: 'column', alignItems: 'flex-start' },
  mobileImageContainer: { marginRight: 0, marginBottom: 10 },
  projectImage: { width: 150, height: 150, borderRadius: 10 },
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
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});

export default ProjectScreen;