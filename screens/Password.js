import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import Header from "../components/Header";
import MaskInput, { Masks } from "react-native-mask-input";
import { useUsuarioData } from "../data/usuarios/UsuarioDataContext";

const Password = ({ navigation }) => {
  const [step, setStep] = useState(1); // 1: email, 2: CPF, 3: nova senha
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    cpf: "",
    novaSenha: "",
    confirmarSenha: "",
  });

  const { usuarios, getUsuarioByEmail, updateUsuario } = useUsuarioData();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = async () => {
    if (!validateEmail(formData.email)) {
      Alert.alert("Erro", "Por favor, insira um e-mail válido");
      return;
    }

    setLoading(true);
    try {
      const user = getUsuarioByEmail(formData.email);
      if (user) {
        setStep(2);
      } else {
        Alert.alert("Erro", "E-mail não encontrado");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível verificar o e-mail");
    } finally {
      setLoading(false);
    }
  };

  const handleCpfSubmit = async () => {
    const cpfLimpo = formData.cpf.replace(/\D/g, "");
    if (cpfLimpo.length !== 11) {
      Alert.alert("Erro", "CPF inválido");
      return;
    }

    setLoading(true);
    try {
      const user = getUsuarioByEmail(formData.email);
      if (user && user.cpf === cpfLimpo) {
        setStep(3);
      } else {
        Alert.alert("Erro", "CPF não corresponde ao e-mail informado");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível verificar o CPF");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (formData.novaSenha !== formData.confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    if (formData.novaSenha.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      const user = getUsuarioByEmail(formData.email);
      if (user) {
        const updatedUser = {
          ...user,
          senha: formData.novaSenha,
        };

        const response = await updateUsuario(updatedUser);
        if (response && response.status === 200) {
          Alert.alert("Sucesso", "Senha atualizada com sucesso!", [
            {
              text: "OK",
              onPress: () => navigation.navigate("Login"),
            },
          ]);
        }
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar a senha");
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <View style={styles.formContainer}>
      <Text style={styles.label}>EMAIL</Text>
      <TextInput
        style={styles.input}
        placeholder="nome@email.com"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => handleInputChange("email", text)}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.sendButton, loading && styles.disabledButton]}
        onPress={handleEmailSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.sendButtonText}>Continuar</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.formContainer}>
      <Text style={styles.label}>CPF</Text>
      <MaskInput
        style={styles.input}
        placeholder="000.000.000-00"
        value={formData.cpf}
        onChangeText={(masked, unmasked) => handleInputChange("cpf", masked)}
        mask={Masks.BRL_CPF}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={[styles.sendButton, loading && styles.disabledButton]}
        onPress={handleCpfSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.sendButtonText}>Verificar CPF</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.formContainer}>
      <Text style={styles.label}>NOVA SENHA</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua nova senha"
        secureTextEntry
        value={formData.novaSenha}
        onChangeText={(text) => handleInputChange("novaSenha", text)}
      />

      <Text style={[styles.label, { marginTop: 15 }]}>CONFIRMAR SENHA</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirme sua nova senha"
        secureTextEntry
        value={formData.confirmarSenha}
        onChangeText={(text) => handleInputChange("confirmarSenha", text)}
      />

      <TouchableOpacity
        style={[styles.sendButton, loading && styles.disabledButton]}
        onPress={handlePasswordSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.sendButtonText}>Atualizar Senha</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Header navigation={navigation} />

        <View style={styles.container}>
          <Text style={styles.title}>Recuperação de Senha</Text>
          <Text style={styles.description}>
            {step === 1 &&
              "Informe seu e-mail para iniciar a recuperação de senha."}
            {step === 2 && "Informe seu CPF para confirmar sua identidade."}
            {step === 3 && "Digite sua nova senha."}
          </Text>

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  container: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#555",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    marginBottom: 25,
  },
  sendButton: {
    backgroundColor: "#648C47",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default Password;
