{/* TELA 24 DO PROTÓTIPO */}

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const HelpRequestFormScreen = () => {
  const [family, setFamily] = useState('');
  const [genus, setGenus] = useState('');
  const [species, setSpecies] = useState('');

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Image source={require('../assets/images/cabecalho.webp')} style={styles.headerImage} />
        <View style={styles.headerContent}>
          <Image source={require('../assets/images/logo.png')} style={styles.logo} />
          <Text style={styles.logoText}>SUG - FLORA</Text>
          <View style={styles.menu}>
            <Text style={styles.menuItem}>FLORAMATCH</Text>
            <Text style={styles.menuItem}>PÁGINA INICIAL</Text>
            <Text style={styles.menuItem}>SAIR</Text>
          </View>
        </View>
      </View>

      {/* Conteúdo */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>PEDIDOS DE AJUDA - DESCONHECIDO 1</Text>

        <TextInput
          placeholder="Espécie achada na Amazônia"
          style={styles.input}
        />
        <TextInput
          placeholder="Sem informações"
          style={styles.input}
        />

        {/* Pickers */}
        <View style={styles.row}>
          <View style={styles.picker}>
            <Picker selectedValue={family} onValueChange={setFamily}>
              <Picker.Item label="Girassol" value="Girassol" />
              <Picker.Item label="Outra família" value="Outra" />
            </Picker>
          </View>
          <View style={styles.picker}>
            <Picker selectedValue={genus} onValueChange={setGenus}>
              <Picker.Item label="Sem informações" value="" />
            </Picker>
          </View>
          <View style={styles.picker}>
            <Picker selectedValue={species} onValueChange={setSpecies}>
              <Picker.Item label="Sem informações" value="" />
            </Picker>
          </View>
        </View>

        <TextInput
          placeholder="Essa espécie foi achada na Amazônia e acredito que seja da família do girassol, porém sua cor é diferente."
          style={styles.textArea}
          multiline
        />

        {/* Imagem da espécie */}
        <View style={styles.imageBox}>
          <Image source={require('../assets/images/flor1.png')} style={styles.speciesImage} />
        </View>

        {/* Lista de ajudas */}
        <Text style={styles.helpTitle}>SUAS AJUDAS</Text>
        <View style={styles.helpList}>
          {[
            {
              name: 'MARIO ROCHA',
              date: '22/03/2025',
              message: 'BOA TARDE, ANALISANDO S...',
            },
            {
              name: 'ANA SILVA',
              date: '23/03/2025',
              message: 'DE ACORDO COM AS INFOR...',
            },
          ].map((item, index) => (
            <View key={index} style={styles.helpItem}>
              <View style={styles.helpInfo}>
                <Text style={styles.helpName}>{item.name}</Text>
                <Text style={styles.helpDate}>{item.date}</Text>
                <Text style={styles.helpMessage}>{item.message}</Text>
              </View>
              <TouchableOpacity style={styles.chatButton}>
                <Text style={styles.chatButtonText}>Abrir chat</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>Confirmar Identificação</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 160, backgroundColor: '#2d5b41' },
  headerImage: { position: 'absolute', width: '100%', height: '100%' },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  logo: { width: 50, height: 50 },
  logoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  menu: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  menuItem: {
    color: '#fff',
    marginHorizontal: 10,
    fontWeight: 'bold',
  },
  content: { padding: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e5641',
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    padding: 10,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  picker: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    marginHorizontal: 5,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    padding: 10,
    textAlignVertical: 'top',
    height: 80,
    marginBottom: 20,
  },
  imageBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  speciesImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
    textTransform: 'uppercase',
  },
  helpList: {
    marginBottom: 20,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  helpInfo: {
    flex: 1,
  },
  helpName: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  helpDate: {
    fontSize: 12,
    marginBottom: 2,
  },
  helpMessage: {
    fontSize: 12,
  },
  chatButton: {
    backgroundColor: '#365c4f',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  confirmButton: {
    backgroundColor: '#365c4f',
    padding: 12,
    alignItems: 'center',
    borderRadius: 4,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HelpRequestFormScreen;
