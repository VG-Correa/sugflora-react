import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const HelpIdentifyScreen = () => {
  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
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
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>FLORAMATCH</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>PÁGINA INICIAL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>SAIR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Conteúdo */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>AJUDE-ME A IDENTIFICAR</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.buttonText}>Buscar Ajuda</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.buttonText}>Solicitações para ajudar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subTitle}>PEDIDOS DE AJUDA</Text>

        <View style={styles.cardsRow}>
          {[
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
          ].map((item, index) => (
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

  content: { padding: 20 },
  titleWrapper: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2e5641' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 30 },
  actionButton: {
    backgroundColor: '#365c4f',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  subTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },

  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  card: {
    width: '30%',
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
});

export default HelpIdentifyScreen;
