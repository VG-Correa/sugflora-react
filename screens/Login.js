import React, { useState } from "react";
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
  Dimensions,
  Alert,
} from "react-native";
import Header from "../components/Header";
import forestImage from "../assets/images/forest.webp";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUsuarioData } from "../data/usuarios/UsuarioDataContext";
import Message from "../Messages/Message";

const Login = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("adm");
  const [password, setPassword] = useState("adm");
  const [loading, setLoading] = useState(false);
  const windowDimensions = Dimensions.get("window");
  const { login } = useUsuarioData();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      const message = await login(username, password);
      console.log("Mensagem: ", message);

      if (message.status === 200) {
        await AsyncStorage.setItem("token", message.data.id.toString());
        await AsyncStorage.setItem("user_id", message.data.id.toString());

        // Salvar dados do usuário no AsyncStorage
        await AsyncStorage.multiSet([
          ["nome", message.data.nome || ""],
          ["sobrenome", message.data.sobrenome || ""],
          ["email", message.data.email || ""],
          ["username", message.data.username || ""],
          ["cpf", message.data.cpf || ""],
          ["rg", message.data.rg || ""],
          ["endereco", message.data.endereco || ""],
        ]);

        navigation.replace("HomePage");
      } else {
        Alert.alert("Erro", "Credenciais incorretas!");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      Alert.alert("Erro", "Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
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
          { width: windowDimensions.width, height: windowDimensions.height },
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <Header navigation={navigation} />

            <View
              style={[
                styles.container,
                {
                  width: isLargeScreen ? "40%" : "90%",
                  marginVertical: isLargeScreen ? 40 : 20,
                  padding: isLargeScreen ? 30 : 20,
                },
              ]}
            >
              <Text
                style={[styles.title, { fontSize: isLargeScreen ? 28 : 24 }]}
              >
                Login
              </Text>

              <Text
                style={[
                  styles.welcomeText,
                  { fontSize: isLargeScreen ? 20 : 16 },
                ]}
              >
                Bem-Vindo de Volta!
              </Text>

              <View style={styles.formContainer}>
                <Text style={styles.label}>USUÁRIO</Text>
                <TextInput
                  style={[
                    styles.input,
                    { paddingVertical: isSmallDevice ? 10 : 12 },
                  ]}
                  placeholder="Nome de Usuário"
                  placeholderTextColor="#888"
                  keyboardType="text"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />

                <Text style={styles.label}>SENHA</Text>
                <TextInput
                  style={[
                    styles.input,
                    { paddingVertical: isSmallDevice ? 10 : 12 },
                  ]}
                  placeholder="*****"
                  placeholderTextColor="#888"
                  secureTextEntry={true}
                  value={password}
                  onChangeText={setPassword}
                />

                <TouchableOpacity
                  style={styles.forgotPasswordButton}
                  onPress={() => navigation.navigate("Password")}
                >
                  <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
                </TouchableOpacity>

                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>Não tem uma conta? </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Register")}
                  >
                    <Text style={styles.createAccount}>Cadastre-se</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    { marginTop: isSmallDevice ? 10 : 20 },
                    loading && styles.disabledButton,
                  ]}
                  onPress={handleLogin}
                  disabled={loading}
                  activeOpacity={0.9}
                >
                  <Text style={styles.loginText}>
                    {loading ? "ENTRANDO..." : "ENTRAR"}
                  </Text>
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
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  background: {
    flex: 1,
    justifyContent: "center",
  },
  flex: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  title: {
    fontWeight: "bold",
    color: "#2d5a27",
    textAlign: "center",
    marginBottom: 8,
  },
  welcomeText: {
    textAlign: "center",
    color: "#444",
    marginBottom: 25,
  },
  formContainer: {
    gap: 15,
  },
  label: {
    fontWeight: "600",
    color: "#444",
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 15,
    backgroundColor: "#fff",
    color: "#333",
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginTop: 5,
  },
  forgotPassword: {
    color: "#648C47",
    fontSize: 14,
    fontWeight: "500",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  registerText: {
    color: "#666",
    fontSize: 14,
  },
  createAccount: {
    color: "#648C47",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  loginButton: {
    backgroundColor: "#648C47",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default Login;
