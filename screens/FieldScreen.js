import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import HeaderInterno from "../components/HeaderInterno";
import ColetaApi from '../functions/api/ColetaApi';

const FieldScreen = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;
  const isMobile = screenWidth < 768;

  const route = useRoute();
  const { campo } = route.params;
  const [coletas, setColetas] = useState([])

  const tableColumnSizes = isMobile
    ? { id: 180, family: 250, genus: 190, species: 290, date: 230, field: 230 }
    : { id: 200, family: 290, genus: 250, species: 330, date: 250, field: 250 };

  const handleAddCollection = () => {
    navigation.navigate('AddCollection', {campo: campo});
  };

  const handleEditField = () => {
    console.log('Editar campo');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const fetchColetas = async () => {
      try {
        const response = ColetaApi.getColetasByCampoId(campo.id);
        setColetas((await response).data.data)
      }catch (error) {
        window.alert("Erro ao carregar coletas: ", error.response.data.message)
      }
    }

    fetchColetas()
  }, [])

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <HeaderInterno />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>PROJETO - {campo.nome}</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.title}>Nome do campo</Text>
          <Text style={styles.label} >{campo.nome}</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.title}>Descrição</Text>
          <Text>{campo.descricao}</Text>
        </View>

        <View style={styles.rowFields}>
          <View style={[styles.fieldGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.title}>País</Text>
            <Text style={styles.label}>{campo.pais}</Text>
          </View>
          <View style={[styles.fieldGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.title}>Estado</Text>
            <Text style={styles.label}>{campo.estado}</Text>
          </View>
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.title}>Cidade</Text>
            <Text style={styles.label}>{campo.cidade}</Text>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.title}>Endereço</Text>
          <Text style={styles.label}>{campo.endereco}</Text>
        </View>

        <Text style={styles.collectionsTitle}>Coletas</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tableScrollContainer}>
          <View>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { width: tableColumnSizes.id }]}>ID</Text>
              <Text style={[styles.tableHeaderText, { width: tableColumnSizes.family }]}>FAMÍLIA</Text>
              <Text style={[styles.tableHeaderText, { width: tableColumnSizes.genus }]}>GÊNERO</Text>
              <Text style={[styles.tableHeaderText, { width: tableColumnSizes.species }]}>ESPÉCIE</Text>
              <Text style={[styles.tableHeaderText, { width: tableColumnSizes.date }]}>DATA DA COLETA</Text>
            </View>

            {coletas.map((campo, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: tableColumnSizes.id }]}>{campo.id}</Text>
                <Text style={[styles.tableCell, { width: tableColumnSizes.family }]}>{campo.familia.nome}</Text>
                <Text style={[styles.tableCell, { width: tableColumnSizes.genus }]}>{campo.genero.nome}</Text>
                <Text style={[styles.tableCell, { width: tableColumnSizes.species }]}>{campo.especie.nome}</Text>
                <Text style={[styles.tableCell, { width: tableColumnSizes.date }]}>{campo.data_coleta}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.addButton]} 
          onPress={handleAddCollection}
          activeOpacity={0.7}
          accessible={true}
          accessibilityLabel="Adicionar nova coleta"
          accessibilityHint="Navega para a tela de criação de nova coleta"
        >
          <Text style={styles.buttonText}>ADICIONAR COLETA</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.editButton]} 
          onPress={handleEditField}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>EDITAR CAMPO</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.backButton]} 
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>VOLTAR</Text>
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
  scrollContent: { padding: 15, paddingBottom: 100 },

  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 15,
    textAlign: 'left'
  },

  fieldGroup: { marginBottom: 15 },
  title: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, color: '#2e7d32' },
  label: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#000'
  },

  rowFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  collectionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginVertical: 15,
    textAlign: 'left',
  },

  tableScrollContainer: { minWidth: '100%' },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e8f5e9',
    paddingVertical: 14,
    paddingHorizontal: 35,
  },
  tableHeaderText: { fontWeight: 'bold', textAlign: 'left', fontSize: 14 },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
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
    right: 0
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 5,
    minWidth: 110,
    maxWidth: 150,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    flexBasis: '30%',
    marginVertical: 5,
  },
  addButton: { backgroundColor: '#2e7d32' },
  editButton: { backgroundColor: '#1565c0' },
  backButton: { backgroundColor: '#999' },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  }
});

export default FieldScreen;
