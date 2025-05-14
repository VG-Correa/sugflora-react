import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import Header from '../components/Header';

const Password = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Header navigation={navigation} />
        
        <View style={styles.container}>
          <Text style={styles.title}>Esqueceu sua senha?</Text>
          <Text style={styles.description}>
            Informe seu e-mail para receber as instruções de redefinição de senha.
          </Text>

          <View style={styles.formContainer}>
            <Text style={styles.label}>EMAIL</Text>
            <TextInput 
              style={styles.input} 
              placeholder="nome@email.com"
              keyboardType="email-address"
            />

            <TouchableOpacity style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    marginBottom: 25,
  },
  sendButton: {
    backgroundColor: '#648C47',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Password;