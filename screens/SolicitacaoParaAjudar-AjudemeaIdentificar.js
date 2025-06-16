import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderInterno from '../components/HeaderInterno';

const dadosSolicitacoes = [
  { especie: 'DESCONHECIDO 1', nome: 'JOANA LIMA', data: '02/03/2023' },
  { especie: 'DESCONHECIDO 1', nome: 'CAIO LUIZ', data: '10/03/2023' },
  { especie: 'DESCONHECIDO 2', nome: 'BRUNA LIMA', data: '10/03/2023' },
  { especie: 'DESCONHECIDO 3', nome: 'ALICE FERREIRA', data: '15/03/2023' },
  { especie: 'DESCONHECIDO 3', nome: 'DOUGLAS MORETTI', data: '02/03/2023' },
  { especie: 'DESCONHECIDO 3', nome: 'FELIPE CINTRA', data: '10/03/2023' },
  { especie: 'DESCONHECIDO 4', nome: 'BRUNO SOUZA', data: '10/03/2023' },
  { especie: 'DESCONHECIDO 2', nome: 'BEATRIZ LIMA', data: '15/03/2023' },
  { especie: 'DESCONHECIDO 2', nome: 'JAQUELINE FERREIRA', data: '02/03/2023' },
];

export default function SolicitacaoParaAjudar() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho visual */}
      <HeaderInterno />

      {/* Conteúdo da tela */}
      <ScrollView style={styles.content} contentContainerStyle={{ padding: 15, paddingBottom: 80 }}>
        <Text style={styles.titulo}>SOLICITAÇÕES PARA AJUDAR</Text>

        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>ESPÉCIE</Text>
          <Text style={styles.headerCell}>NOME</Text>
          <Text style={styles.headerCell}>DATA</Text>
          <Text style={styles.headerCell}>AÇÃO</Text>
        </View>

        <FlatList
          data={dadosSolicitacoes}
          scrollEnabled={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.dataRow}>
              <Text style={styles.dataCell}>{item.especie}</Text>
              <Text style={styles.dataCell}>{item.nome}</Text>
              <Text style={styles.dataCell}>{item.data}</Text>
              <View style={styles.acoes}>
                <Text style={styles.check}>✔️</Text>
                <Text style={styles.cross}>❌</Text>
              </View>
            </View>
          )}
        />

        {/* Botão voltar */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← VOLTAR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e5d45',
    marginBottom: 15,
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 6,
    marginBottom: 5,
    justifyContent: 'center',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  dataRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    justifyContent: 'center',
  },
  dataCell: {
    flex: 1,
    fontSize: 12,
    textAlign: 'center',
  },
  acoes: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  check: { fontSize: 16, color: 'green', marginRight: 5 },
  cross: { fontSize: 16, color: 'red', marginRight: 5 },
  buttonRow: { alignItems: 'center', marginTop: 20 },
  backButton: {
    backgroundColor: '#2e5d45',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  backText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
