import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderInterno from '../components/HeaderInterno';

const ReportScreenQuantitativo = ({ route }) => {
  const navigation = useNavigation();
  const { projectName } = route.params;

  const reportData = {
    projectName: 'Rosa-damascena',
    alternativeNames: ['Rosa-damascena', 'Rosa-de-Damasca'],
    totalCollections: 450,
    identifiedCollections: 320,
    unidentifiedCollections: 130,
    identificationPercentage: '71%', // corrigido
    families: [
      { name: 'ROSACEAE', collections: 85, percentage: '18,8%' },
      { name: 'FABACEAE', collections: 72, percentage: '16%' },
      { name: 'ASTERACEAE', collections: 65, percentage: '14,4%' },
    ],
    fields: [
      { name: 'CAMPO A', total: 180, identified: 140, unidentified: 40, identifiedPercentage: '78%', unidentifiedPercentage: '22%' },
      { name: 'CAMPO B', total: 150, identified: 90, unidentified: 60, identifiedPercentage: '60%', unidentifiedPercentage: '40%' },
      { name: 'CAMPO C', total: 120, identified: 90, unidentified: 30, identifiedPercentage: '75%', unidentifiedPercentage: '25%' },
    ]
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handlePrint = () => {
    console.log('Imprimir relatório');
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <HeaderInterno />
      <ScrollView style={styles.content} contentContainerStyle={{ padding: 15, paddingBottom: 100 }}>
        <Text style={styles.pageTitle}>RELATÓRIO - ECOBOTÂNICA - QUANTITATIVO</Text>

        <View style={styles.box}>
          <Text style={styles.sectionTitle}>NOME DO PROJETO</Text>
          <Text style={styles.sectionText}>- {reportData.projectName}</Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.sectionTitle}>NOMES ALTERNATIVOS</Text>
          {reportData.alternativeNames.map((name, index) => (
            <Text key={index} style={styles.sectionText}>- {name}</Text>
          ))}
        </View>

        <View style={styles.box}>
          <Text style={styles.sectionTitle}>NÚMERO DE CAMPOS</Text>
          <Text style={styles.sectionText}>- {reportData.fields.length}</Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.sectionTitle}>COLETAS</Text>
          <Text style={styles.sectionSubtitle}>TOTAL DE COLETAS</Text>
          <Text style={styles.sectionNumber}>{reportData.totalCollections}</Text>

          <Text style={styles.sectionSubtitle}>COLETAS IDENTIFICADAS</Text>
          <Text style={styles.sectionText}>{reportData.identifiedCollections}</Text>

          <Text style={styles.sectionSubtitle}>COLETAS NÃO IDENTIFICADAS</Text>
          <Text style={styles.sectionText}>{reportData.unidentifiedCollections}</Text>

          <Text style={styles.sectionSubtitle}>% IDENTIFICADAS</Text>
          <Text style={styles.sectionText}>{reportData.identificationPercentage}</Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.sectionTitle}>FAMÍLIAS MAIS FREQUENTES</Text>
          {reportData.families.map((family, index) => (
            <Text key={index} style={styles.sectionText}>
              - {family.name}: {family.collections} coletas ({family.percentage})
            </Text>
          ))}
        </View>

        <View style={styles.box}>
          <Text style={styles.sectionTitle}>DADOS POR CAMPO</Text>
          {reportData.fields.map((field, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text style={styles.sectionSubtitle}>{field.name}</Text>
              <Text style={styles.sectionText}>Total: {field.total}</Text>
              <Text style={styles.sectionText}>Identificadas: {field.identified} ({field.identifiedPercentage})</Text>
              <Text style={styles.sectionText}>Não Identificadas: {field.unidentified} ({field.unidentifiedPercentage})</Text>
            </View>
          ))}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={handleBack}>
            <Text style={styles.buttonText}>VOLTAR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handlePrint}>
            <Text style={styles.buttonText}>IMPRIMIR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerContainer: { height: 160 },
  headerBackgroundImage: { width: '100%', height: '100%', position: 'absolute' },
  headerContent: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 },
  logoImage: { width: 50, height: 50 },
  logoText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  menuTop: { flexDirection: 'row', marginLeft: 'auto' },
  menuItem: { marginHorizontal: 8 },
  menuText: { color: '#fff', fontSize: 14 },

  content: { flex: 1 },
  pageTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  box: { marginBottom: 20, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  sectionSubtitle: { fontSize: 14, fontWeight: '600', marginTop: 5 },
  sectionText: { fontSize: 14 },
  sectionNumber: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  button: { backgroundColor: '#1e90ff', padding: 12, borderRadius: 8, width: '40%', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default ReportScreenQuantitativo;
