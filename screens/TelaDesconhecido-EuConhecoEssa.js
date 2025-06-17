import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import HeaderInterno from '../components/HeaderInterno';

export default function TelaDesconhecidoEuConhecoEssa() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <HeaderInterno />

      {/* Conteúdo */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.titulo}>
          EU CONHEÇO ESSA - DESCONHECIDO 10
        </Text>

        <Text style={styles.descricao}>
          Abaixo estão as informações que o pesquisador conseguiu inserir sobre a espécie coletada.
          Se você reconheceu essa espécie pela foto ou por alguma informação fornecida, clique no botão
          'Oferecer ajuda'. Uma solicitação será enviada ao pesquisador da espécie coletada e, se ele
          aceitar, vocês poderão conversar via chat para trocar informações.
        </Text>

        {/* Formulário */}
        <View style={styles.form}>
          <View style={styles.row}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>LOCAL ONDE FOI ENCONTRADA</Text>
              <TextInput
                style={styles.input}
                value="Espécie achada na Amazônia"
                editable={false}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>NOME DA ESPÉCIE</Text>
              <TextInput
                style={styles.input}
                value="Sem informações"
                editable={false}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>FAMÍLIA</Text>
              <TextInput
                style={styles.input}
                value="Girassol"
                editable={false}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>GÊNERO</Text>
              <TextInput
                style={styles.input}
                value="Sem informações"
                editable={false}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>ESPÉCIE</Text>
              <TextInput
                style={styles.input}
                value="Sem informações"
                editable={false}
              />
            </View>
          </View>

          <Text style={styles.label}>DESCRIÇÃO DA ESPÉCIE</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="Insira informações sobre a espécie para ajudar outros pesquisadores. Obrigatório."
          />

          {/* Imagem antes do botão */}
          <View style={styles.imagemContainer}>
            <Text style={styles.labelImagem}>Imagem</Text>
            <Image
              source={require('../assets/images/flor3.png')}
              style={styles.imagemFlor}
            />
          </View>

          <TouchableOpacity style={styles.botaoAjuda}>
            <Text style={styles.botaoAjudaTexto}>Oferecer ajuda</Text>
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
  headerContent: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, flex: 1 },
  logoImage: { width: 50, height: 50 },
  logoText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  menuTop: { flexDirection: 'row', marginLeft: 'auto' },
  menuItem: { marginHorizontal: 8 },
  menuText: { color: '#fff', fontSize: 14 },

  content: { padding: 20, paddingBottom: 100 },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e5d45',
    marginBottom: 10,
    textAlign: 'left',
  },
  descricao: {
    fontSize: 12,
    color: '#333',
    textAlign: 'justify',
    marginBottom: 20,
  },

  form: {
    flex: 1,
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  inputWrapper: {
    flex: 1,
    minWidth: '30%',
    marginRight: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 4,
    padding: 8,
    fontSize: 13,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 4,
    padding: 10,
    fontSize: 13,
    height: 90,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  botaoAjuda: {
    backgroundColor: '#2e5d45',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
  },
  botaoAjudaTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imagemContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  labelImagem: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 5,
  },
  imagemFlor: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#888',
  },
});
