import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      fromUser: false,
      text: 'Boa tarde, analisando as informações que você colocou da sua espécie, acredito que seja uma rosa do deserto.',
    },
    {
      id: 2,
      fromUser: true,
      text: 'Boa tarde, obrigada pela informação.',
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setChatMessages([...chatMessages, { id: Date.now(), fromUser: true, text: message }]);
    setMessage('');
  };

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

      <View style={styles.chatTitleBox}>
        <Text style={styles.chatTitle}>CHAT DE AJUDA - MARIO ROCHA</Text>
      </View>

      {/* Área de chat */}
      <ScrollView contentContainerStyle={styles.chatBox}>
        {chatMessages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.fromUser ? styles.messageRight : styles.messageLeft,
            ]}
          >
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input de mensagem */}
      <View style={styles.messageInputBox}>
        <TextInput
          placeholder="Mensagem"
          value={message}
          onChangeText={setMessage}
          style={styles.textInput}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Image
            source={require('../assets/images/send-icon.png')}
            style={styles.sendIcon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.exitButton}>
        <Text style={styles.exitButtonText}>Sair do chat</Text>
      </TouchableOpacity>
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
  chatTitleBox: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    alignItems: 'center',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e5641',
    textTransform: 'uppercase',
  },
  chatBox: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#2e9c42',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
    backgroundColor: '#fdeee7',
  },
  messageLeft: {
    alignSelf: 'flex-start',
    borderTopLeftRadius: 0,
  },
  messageRight: {
    alignSelf: 'flex-end',
    borderTopRightRadius: 0,
    backgroundColor: '#fdeee7',
  },
  messageText: {
    fontSize: 14,
    color: '#000',
  },
  messageInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 2,
    borderTopColor: '#2e9c42',
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  sendButton: {
    marginLeft: 10,
  },
  sendIcon: {
    width: 24,
    height: 24,
    tintColor: '#000',
  },
  exitButton: {
    alignSelf: 'center',
    backgroundColor: '#355d46',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 4,
    marginVertical: 10,
  },
  exitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
