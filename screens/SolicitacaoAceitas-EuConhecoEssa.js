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
import HeaderInterno from '../components/HeaderInterno';

export default function SolicitacaoAceitasEuConhecoEssa() {
  const dados = [
    { especie: 'DESCONHECIDO 7', pesquisador: 'JOANA LIMA', data: '02/03/2023' },
    { especie: 'DESCONHECIDO 1', pesquisador: 'CAIO LUIZ', data: '10/03/2023' },
    { especie: 'DESCONHECIDO 2', pesquisador: 'BRUNA LIMA', data: '10/03/2023' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <HeaderInterno />

      {/* Conteúdo */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.titulo}>EU CONHEÇO ESSA - SOLICITAÇÕES ACEITAS</Text>

        <Text style={styles.descricao}>
          Abaixo estão todas as solicitações de ajuda que você fez e que foram aceitas pelos pesquisadores.
          Você pode abrir o chat e oferecer sua ajuda com base nas informações que possui e conhece.
        </Text>

        {/* Tabela */}
        <View style={styles.table}>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.headerCell, { flex: 2 }]}>ESPÉCIE</Text>
            <Text style={[styles.cell, styles.headerCell, { flex: 2.5 }]}>NOME DO PESQUISADOR</Text>
            <Text style={[styles.cell, styles.headerCell, { flex: 2 }]}>DATA DA SOLICITAÇÃO</Text>
            <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>AÇÃO</Text>
          </View>

          {dados.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={[styles.cell, { flex: 2, fontWeight: 'bold' }]}>{item.especie}</Text>
              <Text style={[styles.cell, { flex: 2.5 }]}>{item.pesquisador}</Text>
              <Text style={[styles.cell, { flex: 2 }]}>{item.data}</Text>
              <TouchableOpacity style={[styles.cell, { flex: 1 }]}>
                <View style={styles.chatButton}>
                  <Text style={styles.chatButtonText}>Abrir chat</Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerContainer: { height: 160 },
  headerBackgroundImage: { width: '100%', height: '100%', position: 'absolute' },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    flex: 1,
  },
  logoImage: { width: 50, height: 50 },
  logoText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  menuTop: { flexDirection: 'row', marginLeft: 'auto' },
  menuItem: { marginHorizontal: 8 },
  menuText: { color: '#fff', fontSize: 14 },

  content: { padding: 20 },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e5d45',
    marginBottom: 10,
  },
  descricao: {
    fontSize: 12,
    color: '#333',
    textAlign: 'justify',
    marginBottom: 20,
  },

  table: {
    borderWidth: 1,
    borderColor: '#000',
  },
  headerRow: {
    backgroundColor: '#f8f8f8',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  cell: {
    paddingHorizontal: 6,
    fontSize: 13,
    color: '#000',
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  chatButton: {
    backgroundColor: '#2e5d45',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
