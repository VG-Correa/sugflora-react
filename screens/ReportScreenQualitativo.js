import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import HeaderInterno from '../components/HeaderInterno';

const ReportScreenQualitativo = () => {
  return (
    <View style={styles.container}>
      {/* Cabeçalho visual */}
      <HeaderInterno />
      {/* Conteúdo do relatório qualitativo */}
      <ScrollView style={styles.content} contentContainerStyle={{ padding: 15, paddingBottom: 100 }}>
        <Text style={styles.pageTitle}>RELATÓRIO - ECOBOTÂNICA - QUALITATIVO</Text>

        <View style={styles.box}>
          <Text style={styles.sectionTitle}>OBSERVAÇÕES GERAIS</Text>
          <Text style={styles.sectionText}>
            A diversidade botânica observada nos campos analisados sugere padrões ecológicos relevantes. A presença de espécies indicadoras e o
            comportamento das plantas em relação às variações de solo e clima foram destaque na pesquisa.
          </Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.sectionTitle}>CONDIÇÕES DOS CAMPOS</Text>
          <Text style={styles.sectionText}>
            - Campo A: alta diversidade de Fabaceae e solo argiloso úmido.
          </Text>
          <Text style={styles.sectionText}>
            - Campo B: presença de espécies adaptadas à sombra; solo ácido.
          </Text>
          <Text style={styles.sectionText}>
            - Campo C: vegetação esparsa, domínio de gramíneas resistentes à seca.
          </Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.sectionTitle}>RECOMENDAÇÕES</Text>
          <Text style={styles.sectionText}>
            - Realizar coletas sazonais nos campos B e C para avaliar variação fenológica.
          </Text>
          <Text style={styles.sectionText}>
            - Reforçar o estudo de espécies não identificadas no Campo B.
          </Text>
          <Text style={styles.sectionText}>
            - Mapear polinizadores nas áreas de maior incidência floral.
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>VOLTAR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
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
  sectionText: { fontSize: 14, marginBottom: 6 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  button: { backgroundColor: '#1e90ff', padding: 12, borderRadius: 8, width: '40%', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default ReportScreenQualitativo;
