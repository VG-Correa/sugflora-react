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
  StatusBar
} from 'react-native';
import Header from '../components/Header'; // Importando o Header igual ao Home.js

const Register = ({ navigation }) => {
  const { width: screenWidth } = useWindowDimensions();
  const isLargeScreen = screenWidth > 768;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header IDÊNTICO ao do Home.js */}
        <Header navigation={navigation} />

        {/* TODO O RESTO DO SEU CONTEÚDO ORIGINAL (FORMULÁRIO DE CADASTRO) */}
        <View style={[styles.container, { padding: isLargeScreen ? 40 : 20 }]}>
          <Text style={styles.title}>Cadastro</Text>
          <Text style={styles.loginText}>Já tem conta? Login</Text>

          <View style={styles.formContainer}>
            {/* Seção 1 */}
            <View style={[styles.section, { flexDirection: isLargeScreen ? 'row' : 'column' }]}>
              <View style={[styles.inputGroup, { flex: isLargeScreen ? 1 : 1 }]}>
                <Text style={styles.label}>NOME</Text>
                <TextInput style={styles.input} placeholder="Seu nome" />
              </View>
              <View style={[styles.inputGroup, { flex: isLargeScreen ? 1 : 1 }]}>
                <Text style={styles.label}>DATA DE NASCIMENTO</Text>
                <TextInput style={styles.input} placeholder="dd/mm/aaaa" />
              </View>
            </View>

            {/* Seção 2 */}
            <View style={[styles.section, { flexDirection: isLargeScreen ? 'row' : 'column' }]}>
              <View style={[styles.inputGroup, { flex: isLargeScreen ? 1 : 1 }]}>
                <Text style={styles.label}>ESTADO</Text>
                <TextInput style={styles.input} placeholder="Selecione..." />
              </View>
              <View style={[styles.inputGroup, { flex: isLargeScreen ? 1 : 1 }]}>
                <Text style={styles.label}>CIDADE</Text>
                <TextInput style={styles.input} placeholder="Selecione..." />
              </View>
            </View>

            {/* Seção 3 */}
            <View style={[styles.section, { flexDirection: isLargeScreen ? 'row' : 'column' }]}>
              <View style={[styles.inputGroup, { flex: isLargeScreen ? 1 : 1 }]}>
                <Text style={styles.label}>RG</Text>
                <TextInput style={styles.input} placeholder="RG" />
              </View>
              <View style={[styles.inputGroup, { flex: isLargeScreen ? 1 : 1 }]}>
                <Text style={styles.label}>CPF</Text>
                <TextInput style={styles.input} placeholder="CPF" />
              </View>
            </View>

            {/* Seção 4 */}
            <View style={[styles.section, { flexDirection: isLargeScreen ? 'row' : 'column' }]}>
              <View style={[styles.inputGroup, { flex: isLargeScreen ? 1 : 1 }]}>
                <Text style={styles.label}>SEXO</Text>
                <TextInput style={styles.input} placeholder="Selecione..." />
              </View>
              <View style={[styles.inputGroup, { flex: isLargeScreen ? 1 : 1 }]}>
                <Text style={styles.label}>PAÍS</Text>
                <TextInput style={styles.input} placeholder="Selecione..." />
              </View>
            </View>

            {/* Seção 5 */}
            <View style={styles.section}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>ENDEREÇO DE E-MAIL</Text>
                <TextInput style={styles.input} placeholder="nome@exemplo.com" />
              </View>
            </View>

            {/* Seção 6 */}
            <View style={[styles.section, { flexDirection: isLargeScreen ? 'row' : 'column' }]}>
              <View style={[styles.inputGroup, { flex: isLargeScreen ? 1 : 1 }]}>
                <Text style={styles.label}>SENHA</Text>
                <TextInput style={styles.input} placeholder="*****" secureTextEntry={true} />
              </View>
              <View style={[styles.inputGroup, { flex: isLargeScreen ? 1 : 1 }]}>
                <Text style={styles.label}>CONFIRMAR SENHA</Text>
                <TextInput style={styles.input} placeholder="*****" secureTextEntry={true} />
              </View>
            </View>

            {/* Termos e condições */}
            <View style={styles.termsContainer}>
              <TouchableOpacity style={styles.checkbox}>
                <View style={styles.checkboxInner} />
              </TouchableOpacity>
              <Text style={styles.termsText}>Eu aceito os termos e política de privacidade</Text>
            </View>

            {/* Botão de cadastro */}
            <TouchableOpacity style={styles.registerButton}>
              <Text style={styles.registerButtonText}>Cadastrar-se</Text>
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
    backgroundColor: '#fff',
    paddingBottom: 30,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  loginText: {
    color: '#648C47',
    textAlign: 'center',
    marginBottom: 30,
    textDecorationLine: 'underline',
  },
  formContainer: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
  },
  section: {
    marginBottom: 20,
    gap: 15,
  },
  inputGroup: {
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 3,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#648C47',
    borderRadius: 2,
  },
  termsText: {
    fontSize: 14,
  },
  registerButton: {
    backgroundColor: '#648C47',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Register;