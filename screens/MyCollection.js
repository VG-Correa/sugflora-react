import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MyCollectionsScreen = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;
  const isMobile = screenWidth < 768;

  const tableColumnSizes = isMobile
    ? { id: 210, family: 270, genus: 230, species: 270, date: 250, field: 250 }
    : { id: 230, family: 300, genus: 270, species: 330, date: 270, field: 300 };

  const collectionsData = [
    { id: '0001', family: 'ROSACEAE', genus: 'ROSA', species: 'ROSA GALLICA', date: '02/03/2023', field: 'CAMPO 1' },
    { id: '0002', family: 'ROSACEAE', genus: 'ROSA', species: 'ROSA DAMASCENA', date: '10/03/2023', field: 'CAMPO 1' },
    { id: '0003', family: 'ROSACEAE', genus: 'ROSA', species: 'ROSA CANINA', date: '10/03/2023', field: 'CAMPO 1' },
    { id: '0004', family: 'ROSACEAE', genus: 'ROSA', species: 'ROSA DAMASCENA', date: '15/03/2023', field: 'CAMPO 1' },
    { id: '0005', family: 'ROSACEAE', genus: 'ROSA', species: 'ROSA GALLICA', date: '02/03/2023', field: 'CAMPO 2' },
    { id: '0006', family: 'ROSACEAE', genus: 'ROSA', species: 'ROSA DAMASCENA', date: '10/03/2023', field: 'CAMPO 2' },
    { id: '0007', family: 'ROSACEAE', genus: 'ROSA', species: 'ROSA CANINA', date: '10/03/2023', field: 'CAMPO 2' },
    { id: '0008', family: 'ROSACEAE', genus: 'ROSA', species: 'ROSA DAMASCENA', date: '15/03/2023', field: 'CAMPO 2' },
    { id: '0009', family: 'ROSACEAE', genus: 'ROSA', species: 'ROSA GALLICA', date: '02/03/2023', field: 'CAMPO 2' },
  ];

  const handleAddCollection = () => {
    navigation.navigate('AddCollection');
  };

  const handleGenerateReport = () => {
    console.log('Gerar relatório');
  };

  const handleBack = () => {
    navigation.goBack();
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
        <Text style={styles.pageTitle}>MINHAS COLETAS</Text>

        {/* Tabela de Coletas */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.tableScrollContainer}
        >
          <View>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { width: tableColumnSizes.id }]}>ID</Text>
              <Text style={[styles.tableHeaderText, { width: tableColumnSizes.family }]}>FAMÍLIA</Text>
              <Text style={[styles.tableHeaderText, { width: tableColumnSizes.genus }]}>GÊNERO</Text>
              <Text style={[styles.tableHeaderText, { width: tableColumnSizes.species }]}>ESPÉCIE</Text>
              <Text style={[styles.tableHeaderText, { width: tableColumnSizes.date }]}>DATA DA COLETA</Text>
              <Text style={[styles.tableHeaderText, { width: tableColumnSizes.field }]}>CAMPO</Text>
            </View>

            {collectionsData.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: tableColumnSizes.id }]}>{item.id}</Text>
                <Text style={[styles.tableCell, { width: tableColumnSizes.family }]}>{item.family}</Text>
                <Text style={[styles.tableCell, { width: tableColumnSizes.genus }]}>{item.genus}</Text>
                <Text style={[styles.tableCell, { width: tableColumnSizes.species }]}>{item.species}</Text>
                <Text style={[styles.tableCell, { width: tableColumnSizes.date }]}>{item.date}</Text>
                <Text style={[styles.tableCell, { width: tableColumnSizes.field }]}>{item.field}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>

      {/* Action buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.addButton]} 
          onPress={handleAddCollection}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>ADICIONAR COLETA</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.reportButton]} 
          onPress={handleGenerateReport}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>GERAR RELATÓRIO</Text>
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

  tableScrollContainer: { minWidth: '100%' },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e8f5e9',
    paddingVertical: 14,
    paddingHorizontal: 35,
  },
  tableHeaderText: { 
    fontWeight: 'bold', 
    textAlign: 'left', 
    fontSize: 14,
    color: '#2e7d32'
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCell: { 
    textAlign: 'left', 
    fontSize: 14,
    color: '#333'
  },

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
  reportButton: { backgroundColor: '#1565c0' },
  backButton: { backgroundColor: '#999' },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  }
});

export default MyCollectionsScreen;
