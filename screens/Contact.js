import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import Header from '../components/Header';

const ContactScreen = ({ navigation }) => {
  const { width: screenWidth } = useWindowDimensions();
  const isLargeScreen = screenWidth > 768;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Header navigation={navigation} />
        
        <View style={[
          styles.contentWrapper,
          { 
            flexDirection: isLargeScreen ? 'row' : 'column',
            gap: isLargeScreen ? 40 : 20,
            paddingHorizontal: isLargeScreen ? 40 : 20,
            display: 'flex',
            justifyContent: 'center',
          }
        ]}>
          {/* Seção de Informações */}
          <View style={styles.infoContainer}>
            <Text style={styles.sectionTitle}>Contato</Text>
            <Text style={styles.description}>
              Por favor preencha o formulário ao lado para nos enviar um e-mail.
            </Text>
            
            <View style={styles.separator} />
            
            <TouchableOpacity>
              <Text style={styles.emailText}>suaflora@contato.com</Text>
            </TouchableOpacity>
          </View>

          {/* Formulário */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>NOME</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome completo"
            />

            <Text style={styles.label}>E-MAIL</Text>
            <TextInput
              style={styles.input}
              placeholder="seuemail@exemplo.com"
              keyboardType="email-address"
            />

            <Text style={styles.label}>ASSUNTO</Text>
            <TextInput
              style={styles.input}
              placeholder="Descreva o assunto"
            />

            <Text style={styles.label}>MENSAGEM</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Escreva sua mensagem"
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity style={styles.submitButton}>
              <Text style={styles.submitText}>ENVIAR</Text>
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
    paddingBottom: 40,
  },
  contentWrapper: {
    flex: 1,
    paddingTop: 20,
  },
  infoContainer: {
    flex: 1,
    maxWidth: 400,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d5a27',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 25,
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginVertical: 20,
    width: '80%',
  },
  emailText: {
    fontSize: 16,
    color: '#648C47',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  formContainer: {
    flex: 1,
    maxWidth: 500,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#648C47',
    padding: 15,
    borderRadius: 8,
    marginTop: 25,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ContactScreen;