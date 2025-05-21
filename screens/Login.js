import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Platform,
  StatusBar,
  ImageBackground,
  useWindowDimensions,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions
} from 'react-native';
import Header from '../components/Header';
import forestImage from '../assets/images/forest.webp';
import loginApi from '../functions/api/loginApi';
import usuarioApi from '../functions/api/usuarioApi';

const Login = ({ navigation }) => {
  const usernameRef = useRef(null);
  const passRef = useRef(null);
  const windowDimensions = Dimensions.get('window');

  const handleLogin = async (event) => {
    event.preventDefault();

    const username = usernameRef.current.value;
    const password = passRef.current.value;
    
    const response = await loginApi.login(username, password);

    if (response.status === 200) {
      localStorage.setItem('token', response.data.token);
      
      const usuarioLogado = await usuarioApi.getUserByUsername(username);
      if (usuarioLogado != null && usuarioLogado.status === 200) {
        localStorage.setItem('user_id', usuarioLogado.data.data[0].id);
        localStorage.setItem('username', usuarioLogado.data.data[0].username);
        navigation.navigate('HomePage');
      } else {
        localStorage.removeItem('token');
      }
    } else {
      window.alert("Credenciais inválidas");
    }
  };

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isLargeScreen = screenWidth >= 768;
  const isSmallDevice = screenHeight < 600;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={forestImage}
        resizeMode="cover"
        style={[
          styles.background,
          { width: windowDimensions.width, height: windowDimensions.height }
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <Header navigation={navigation} />

            <View style={[
              styles.container,
              {
                width: isLargeScreen ? '40%' : '90%',
                marginVertical: isLargeScreen ? 40 : 20,
                padding: isLargeScreen ? 30 : 20,
              }
            ]}>
              <Text style={[
                styles.title,
                { fontSize: isLargeScreen ? 28 : 24 }
              ]}>
                Login
              </Text>
              
              <Text style={[
                styles.welcomeText,
                { fontSize: isLargeScreen ? 20 : 16 }
              ]}>
                Bem-Vindo de Volta!
              </Text>

              <View style={styles.socialOptions}>
                <TouchableOpacity 
                  style={[styles.socialButton, styles.unselectedSocial]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.socialText}>Entre com Google</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.socialButton, styles.selectedSocial]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.socialText, styles.socialSelectedText]}>Entre com Facebook</Text>
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
                  ref={usernameRef}
                  style={[
                    styles.input,
                    { paddingVertical: isSmallDevice ? 10 : 12 }
                  ]}
                  placeholder="home@exemplo.com"
                  placeholderTextColor="#888"
                  keyboardType="email-address"
                  defaultValue='VG'
                />

                <Text style={styles.label}>SENHA</Text>
                <TextInput 
                  ref={passRef}
                  style={[
                    styles.input,
                    { paddingVertical: isSmallDevice ? 10 : 12 }
                  ]}
                  placeholder="*****"
                  placeholderTextColor="#888"
                  secureTextEntry={true}
                  defaultValue='test'
                />

                <TouchableOpacity style={styles.forgotPasswordButton}>
                  <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
                </TouchableOpacity>

                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>Não tem uma conta? </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.createAccount}>Cadastre-se</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    { marginTop: isSmallDevice ? 10 : 20 }
                  ]}
                  onPress={(event) => {handleLogin(event)}}
                  activeOpacity={0.9}
                >
                  <Text style={styles.loginText}>ENTRAR</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
    flex: 1,
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  title: {
    fontWeight: 'bold',
    color: '#2d5a27',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeText: {
    textAlign: 'center',
    color: '#444',
    marginBottom: 25,
  },
  socialOptions: {
    marginBottom: 25,
    gap: 12,
  },
  socialButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  selectedSocial: {
    backgroundColor: '#4267B2',
    borderColor: '#4267B2',
  },
  unselectedSocial: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
  },
  socialText: {
    fontWeight: '600',
    fontSize: 14,
  },
  socialSelectedText: {
    color: '#fff',
  },
  dividerContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    alignItems: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 14,
  },
  formContainer: {
    gap: 15,
  },
  label: {
    fontWeight: '600',
    color: '#444',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 15,
    backgroundColor: '#fff',
    color: '#333',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  forgotPassword: {
    color: '#648C47',
    fontSize: 14,
    fontWeight: '500',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  registerText: {
    color: '#666',
    fontSize: 14,
  },
  createAccount: {
    color: '#648C47',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#648C47',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default Login;