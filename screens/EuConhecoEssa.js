import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const dadosSolicitacoes = [
  { especie: 'DESCONHECIDA 4', data: '22/03/2025', mensagem: 'BOA TARDE, ANALISANDO S...', status: 'ATIVO' },
  { especie: 'DESCONHECIDA 5', data: '23/03/2025', mensagem: 'DE ACORDO COM AS INFOR...', status: 'INATIVO' },
];

const muralDeAjudas = [
  {
    nome: 'Desconhecido 1',
    projeto: 'EcoBotânica',
    ajudas: '2',
    status: 'Aberta',
    cor: '#f2caff',
    foto: require('../assets/images/flor1.png'),
  },
  {
    nome: 'Desconhecido 2',
    projeto: 'EcoBotânica',
    ajudas: '1',
    status: 'Resolvido',
    cor: '#ffd47f',
    foto: require('../assets/images/flor2.png'),
  },
  {
    nome: 'Desconhecido 3',
    projeto: 'Amazônia',
    ajudas: '3',
    status: 'Resolvido',
    cor: '#cfe9c4',
    foto: require('../assets/images/flor3.png'),
  },
];

export default function TelaSolicitacaoParaAjudar() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho visual */}
      <View style={styles.headerContainer}>
        <Image source={require('../assets/images/cabecalho.webp')} style={styles.headerBackgroundImage} resizeMode="cover" />
        <View style={styles.headerContent}>
          <Image source={require('../assets/images/logo.png')} style={styles.logoImage} resizeMode="contain" />
          <Text style={styles.logoText}>SUG - FLORA</Text>
          <View style={styles.menuTop}>
            <TouchableOpacity style={styles.menuItem}><Text style={styles.menuText}>FLORAMATCH</Text></TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}><Text style={styles.menuText}>PÁGINA INICIAL</Text></TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}><Text style={styles.menuText}>SAIR</Text></TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ padding: 15, paddingBottom: 80 }}>
        <Text style={styles.titulo}>EU CONHEÇO ESSA!</Text>

        <TouchableOpacity style={styles.buttonAceitas}>
          <Text style={styles.buttonAceitasText}>Solicitações aceitas</Text>
        </TouchableOpacity>

        <Text style={styles.subTitle}>SUAS AJUDAS</Text>

        <View style={styles.tableHeader}>
          <Text style={styles.tableCell}>NOME DO PESQUISADOR</Text>
          <Text style={styles.tableCell}>DATA</Text>
          <Text style={styles.tableCell}>MENSAGEM</Text>
          <Text style={styles.tableCell}>STATUS</Text>
        </View>

        {dadosSolicitacoes.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.especie}</Text>
            <Text style={styles.tableCell}>{item.data}</Text>
            <Text style={styles.tableCell}>{item.mensagem}</Text>
            <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{item.status}</Text>
            <TouchableOpacity style={styles.chatButton}>
              <Text style={styles.chatButtonText}>Abrir chat</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Mural de Ajudas */}
        <Text style={styles.muralTitle}>MURAL DE AJUDAS</Text>
        <View style={styles.cardsRow}>
          {muralDeAjudas.map((item, index) => (
            <View key={index} style={[styles.card, { backgroundColor: item.cor }]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.nome}</Text>
                <Image source={item.foto} style={styles.cardImage} />
              </View>
              <Text style={styles.cardText}>PROJETO: {item.projeto}</Text>
              <Text style={styles.cardText}>AJUDAS: {item.ajudas}</Text>
              <Text style={styles.cardText}>STATUS DO PEDIDO: {item.status}</Text>
              <TouchableOpacity style={styles.verMaisButton}>
                <Text style={styles.verMaisText}>Ver mais</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e5d45',
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonAceitas: {
    backgroundColor: '#365c4f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 20,
  },
  buttonAceitasText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    textAlign: 'center',
  },
  chatButton: {
    backgroundColor: '#2e5d45',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 12,
  },

  muralTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e5d45',
    marginTop: 30,
    marginBottom: 15,
    textAlign: 'center',
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '48%',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  cardText: {
    fontSize: 12,
    marginTop: 6,
  },
  verMaisButton: {
    backgroundColor: '#333',
    paddingVertical: 6,
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  verMaisText: { color: '#fff', fontSize: 12 },

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
