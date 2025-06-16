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
import Icon from 'react-native-vector-icons/MaterialIcons';
import HeaderInterno from '../components/HeaderInterno';

const MyReportsScreen = () => {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;
  const isMobile = screenWidth < 768;

  const tableColumnSizes = isMobile
    ? { project: 380, type: 320, date: 280, action: 240 }
    : { project: 480, type: 380, date: 320, action: 290 };

  const reportsData = [
    { project: 'ECOBOTÂNICA', type: 'QUANTITATIVO', date: '02/03/2023' },
    { project: 'NATURALIS', type: 'QUANTITATIVO', date: '10/03/2023' },
    { project: 'NATURALIS', type: 'QUALITATIVO', date: '10/03/2023' },
    { project: 'CERRADO', type: 'QUANTITATIVO', date: '15/03/2023' },
    { project: 'AMAZÔNIA', type: 'QUALITATIVO', date: '02/03/2023' },
    { project: 'AQUAFLOW', type: 'QUALITATIVO', date: '10/03/2023' },
    { project: 'AQUAFLOW', type: 'QUANTITATIVO', date: '10/03/2023' },
    { project: 'FLORAVIVA', type: 'QUALITATIVO', date: '15/03/2023' },
    { project: 'BIORAIZES', type: 'QUANTITATIVO', date: '02/03/2023' },
  ];

  const handleProjectPress = (projectName) => {
    console.log('Abrir projeto:', projectName);
  };

  const handleFolderPress = (report) => {
    console.log('Abrir pasta do relatório:', report);
  };

  const handlePrintPress = (report) => {
    console.log('Imprimir relatório:', report);
  };

  const handleBack = () => {
    navigation.navigate('HomePage');
  };

  return (
    <View style={styles.container}>
      
      <HeaderInterno />


      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>MEUS RELATÓRIOS</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tableScrollContainer}
        >
          <View>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { width: tableColumnSizes.project }]}>PROJETO</Text>
              <Text style={[styles.tableHeaderText, { width: tableColumnSizes.type }]}>TIPO</Text>
              <Text style={[styles.tableHeaderText, { width: tableColumnSizes.date }]}>DATA</Text>
              <Text style={[styles.tableHeaderText, { width: tableColumnSizes.action }]}>AÇÃO</Text>
            </View>

            {reportsData.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <TouchableOpacity
                  style={[styles.tableCell, { width: tableColumnSizes.project }]}
                  onPress={() => handleProjectPress(item.project)}
                >
                  <Text style={styles.projectText}>{item.project}</Text>
                </TouchableOpacity>

                <Text style={[styles.tableCell, { width: tableColumnSizes.type }]}>{item.type}</Text>
                <Text style={[styles.tableCell, { width: tableColumnSizes.date }]}>{item.date}</Text>

                <View style={[styles.tableCell, { width: tableColumnSizes.action, flexDirection: 'row' }]}>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handleFolderPress(item)}>
                    <Icon name="folder" size={20} color="#2e7d32" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={() => handlePrintPress(item)}>
                    <Icon name="print" size={20} color="#2e7d32" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.backButton]} onPress={handleBack} activeOpacity={0.7}>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 15,
    textAlign: 'center', // ✅ CENTRALIZADO
  },

  tableScrollContainer: { minWidth: '100%' },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e8f5e9',
    paddingVertical: 14,
    paddingHorizontal: 15,
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
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  tableCell: {
    justifyContent: 'center',
  },
  projectText: {
    fontSize: 14,
    color: '#2e7d32', // ✅ VERDE
    fontWeight: 'bold', // ✅ NEGRITO
    textDecorationLine: 'underline', // ✅ SUBLINHADO
  },
  actionButton: {
    padding: 5,
    marginHorizontal: 5,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
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
    marginVertical: 5,
  },
  backButton: { backgroundColor: '#999' },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  }
});

export default MyReportsScreen;
