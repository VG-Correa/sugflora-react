{/* TELA 30 DO PROTÓTIPO */}

import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import HeaderInterno from '../components/HeaderInterno';

export default function ChatEuConhecoEssa() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <HeaderInterno />

      {/* Conteúdo */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>EU CONHEÇO ESSA - CHAT DE AJUDA - DESCONHECIDO 7</Text>

        {/* Campos */}
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Local Onde Foi Encontrada</Text>
            <TextInput
              style={styles.input}
              value="Espécie achada na Amazônia"
              editable={false}
            />
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Nome da Espécie</Text>
            <TextInput
              style={styles.input}
              value="Sem informações"
              editable={false}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Família</Text>
            <View style={styles.input}>
              <Picker selectedValue="Girassol" enabled={false}>
                <Picker.Item label="Girassol" value="Girassol" />
              </Picker>
            </View>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Gênero</Text>
            <View style={styles.input}>
              <Picker selectedValue="Sem informações" enabled={false}>
                <Picker.Item label="Sem informações" value="Sem informações" />
              </Picker>
            </View>
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Espécie</Text>
            <View style={styles.input}>
              <Picker selectedValue="Sem informações" enabled={false}>
                <Picker.Item label="Sem informações" value="Sem informações" />
              </Picker>
            </View>
          </View>
        </View>

        {/* Descrição */}
        <Text style={styles.label}>Descrição da Espécie</Text>
        <TextInput
          style={styles.input}
          value="Insira informações sobre a espécie para ajudar outros pesquisadores. Obrigatório."
          editable={false}
        />

        {/* Imagem da planta */}
        <View style={styles.imageSection}>
          <Text style={styles.imageLabel}>Imagem</Text>
          <Image
            source={require('../assets/images/flor1.png')}
            style={styles.flowerImage}
          />
        </View>

        {/* Chat */}
        <View style={styles.chatContainer}>
          <View style={styles.chatBubble}>
            <Text style={styles.chatText}>
              Boa tarde, analisando as informações que você colocou da sua espécie, acredito que seja uma rosa do deserto.
            </Text>
          </View>
        </View>

        {/* Caixa de mensagem */}
        <View style={styles.inputMessageContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Mensagem"
            placeholderTextColor="#000"
          />
          <TouchableOpacity style={styles.sendButton}>
            <Image
              source={require('../assets/images/send-icon.png')}
              style={styles.sendIcon}
            />
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e5d45',
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: '#000',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 10,
    height: 40,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  column: {
    flex: 1,
    marginVertical: 5,
  },
  imageSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  imageLabel: {
    fontSize: 14,
    marginBottom: 10,
  },
  flowerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  chatContainer: {
    backgroundColor: '#2e5d45',
    padding: 20,
    marginTop: 20,
    borderRadius: 5,
  },
  chatBubble: {
    backgroundColor: '#fceae5',
    padding: 15,
    borderRadius: 10,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  chatText: {
    color: '#333',
    fontSize: 14,
  },
  inputMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e5d45',
    padding: 10,
    marginTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  messageInput: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    flex: 1,
    height: 40,
    color: '#000',
  },
  sendButton: {
    marginLeft: 10,
  },
  sendIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
});
