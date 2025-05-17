import React from 'react';
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
import { useNavigation } from '@react-navigation/native';

const FieldScreen = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;
  const isMobile = screenWidth < 768;

  const tableColumnSizes = isMobile
    ? { name: 140, others: 80 }
    : { name: 220, others: 120 };

  const handleAddCollection = () => {
    console.log('Adicionar coleta');
  };
  const handleEditField = () => {
    console.log('Editar campo');
  };
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.headerContainer}>
        <Image
          source={require('../assets/images/cabecalho.png')}
          style={styles.headerBackgroundImage}
          resizeMode="cover"
        />
        <View style={styles.headerContent}>
          <Image
            source={require('../assets/images/logo.png')}
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
        <Text style={styles.pageTitle}>PROJETO - EXEMPLO - CAMPO 1</Text>

        {/* Campos de formulário */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Nome do campo</Text>
          <TextInput style={styles.textInput} placeholder="Campo 1" />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Data de início</Text>
          <TextInput style={[styles.textInput, { width: 180 }]} placeholder="19/01/2023" />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.textInput, { height: 80 }]}
            placeholder="Descrição do campo"
            multiline
          />
        </View>

        <View style={styles.rowFields}>
          <View style={[styles.fieldGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>País</Text>
            <TextInput style={styles.textInput} placeholder="Brasil" />
          </View>
          <View style={[styles.fieldGroup, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Estado</Text>
            <TextInput style={styles.textInput} placeholder="SP" />
          </View>
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>Cidade</Text>
            <TextInput style={styles.textInput} placeholder="Ferraz de Vasconcelos" />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Endereço</Text>
          <TextInput style={styles.textInput} placeholder="Rua Exemplo, 123" />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Previsão de conclusão</Text>
          <TextInput style={[styles.textInput, { width: 180 }]} placeholder="01/04/2026" />
        </View>

        <Text style={styles.collectionsTitle}>Coletas</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tableScrollContainer}>
          <View>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { width: tableColumnSizes.name }]}>Data</Text>
              <Text style={[styles.tableHeaderText, { width: tableColumnSizes.others }]}>Quantidade</Text>
              <Text style={[styles.tableHeaderText, { width: tableColumnSizes.others }]}>Status</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: tableColumnSizes.name }]}>20/04/2025</Text>
              <Text style={[styles.tableCell, { width: tableColumnSizes.others }]}>10</Text>
              <Text style={[styles.tableCell, { width: tableColumnSizes.others }]}>Completo</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: tableColumnSizes.name }]}>22/04/2025</Text>
              <Text style={[styles.tableCell, { width: tableColumnSizes.others }]}>8</Text>
              <Text style={[styles.tableCell, { width: tableColumnSizes.others }]}>Pendente</Text>
            </View>
          </View>
        </ScrollView>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.addButton]} onPress={handleAddCollection}>
          <Text style={styles.buttonText}>ADICIONAR COLETA</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleEditField}>
          <Text style={styles.buttonText}>EDITAR CAMPO</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.backButton]} onPress={handleBack}>
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
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, color: '#2e7d32' },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
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