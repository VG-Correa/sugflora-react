import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Platform,
  StatusBar,
  ImageBackground
} from 'react-native';

import Header from '../components/Header';
import forestImage from '../assets/images/forest.png'; // ajuste o caminho se necessário

const Login = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={forestImage}
        resizeMode="cover"
        style={styles.background}
      >
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
          
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate('HomePage')}
            >
              <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  background: {
    // flex: 1,
    width: '100%',
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    top: 0,
    height: Platform.OS === 'android' ? "95%" : "90%",
    width: Platform.OS === 'android' ? "85%" : "30%",
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
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
    color: '#000',
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
    backgroundColor: '#fff',
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
    marginBottom: 5,
  },
  loginButton: {
    backgroundColor: '#648C47',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default Login;
