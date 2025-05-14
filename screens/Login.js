import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  TextInput,
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import Header from '../components/Header';

const Login = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Header navigation={navigation} />

        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.welcomeText}>Bem-Vindo de Volta!</Text>

          <View style={styles.socialOptions}>
            <TouchableOpacity style={[styles.socialButton, styles.unselectedSocial]}>
              <Text style={styles.socialText}>Entre com Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.socialButton, styles.selectedSocial]}>
              <Text style={styles.socialText}>Entre com Facebook</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>EMAIL</Text>
            <TextInput 
              style={styles.input} 
              placeholder="home@exemplo.com"
              keyboardType="email-address"
            />

            <Text style={styles.label}>SENHA</Text>
            <TextInput 
              style={styles.input} 
              placeholder="*****" 
              secureTextEntry={true}
            />

            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.createAccount}>Crie uma conta</Text>
            </TouchableOpacity>
          </View>

          {/* ÚNICA ALTERAÇÃO (linha do onPress) */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('HomePage')} // ← Apenas esta linha foi alterada
          >
            <Text style={styles.loginText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/* SEUS ESTILOS ORIGINAIS (totalmente inalterados) */
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
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  socialOptions: {
    marginBottom: 30,
  },
  socialButton: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  selectedSocial: {
    backgroundColor: '#4267B2',
    borderColor: '#4267B2',
  },
  unselectedSocial: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  socialText: {
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
  },
  formContainer: {
    marginBottom: 30,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  forgotPassword: {
    color: '#648C47',
    textAlign: 'right',
    marginBottom: 15,
  },
  createAccount: {
    color: '#648C47',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#648C47',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14, // Reduzido
  },
});

export default Login;