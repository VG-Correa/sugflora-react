import React, { useState, useEffect } from "react";
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
  Alert,
  ActivityIndicator,
  Picker,
} from "react-native";
import Header from "../components/Header"; // Importando o Header igual ao Home.js
import MaskInput, { Masks } from "react-native-mask-input";
import axios from "axios";
import UsuarioApi from "../functions/api/usuarioApi";

const Register = ({ navigation }) => {
  const { width: screenWidth } = useWindowDimensions();
  const isLargeScreen = screenWidth > 768;

  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    cpf: "",
    rg: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    role: "USER",
  });

  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Buscar estados do IBGE
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await axios.get(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
        );
        const estadosOrdenados = response.data.sort((a, b) =>
          a.nome.localeCompare(b.nome)
        );
        setEstados(estadosOrdenados);
      } catch (error) {
        console.error("Erro ao buscar estados:", error);
      }
    };
    fetchEstados();
  }, []);

  // Buscar cidades quando o estado for selecionado
  useEffect(() => {
    const fetchCidades = async () => {
      if (!formData.estado) return;

      setLoadingCidades(true);
      try {
        const response = await axios.get(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.estado}/municipios`
        );
        const cidadesOrdenadas = response.data.sort((a, b) =>
          a.nome.localeCompare(b.nome)
        );
        setCidades(cidadesOrdenadas);
      } catch (error) {
        console.error("Erro ao buscar cidades:", error);
      } finally {
        setLoadingCidades(false);
      }
    };
    fetchCidades();
  }, [formData.estado]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    console.log("Iniciando validação do formulário...");
    console.log("Dados do formulário:", formData);

    // Validação de CPF
    const cpfLimpo = formData.cpf.replace(/\D/g, "");
    if (cpfLimpo.length !== 11) {
      console.log("CPF inválido:", formData.cpf);
      Alert.alert("Erro", "CPF inválido");
      return false;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      console.log("Email inválido:", formData.email);
      Alert.alert("Erro", "Email inválido");
      return false;
    }

    // Validação de CEP
    const cepLimpo = formData.cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      console.log("CEP inválido:", formData.cep);
      Alert.alert("Erro", "CEP inválido");
      return false;
    }

    // Validação dos campos obrigatórios
    const camposObrigatorios = {
      nome: "Nome",
      email: "Email",
      senha: "Senha",
      confirmarSenha: "Confirmação de senha",
      cpf: "CPF",
      rg: "RG",
      endereco: "Endereço",
      cidade: "Cidade",
      estado: "Estado",
    };

    for (const [campo, nome] of Object.entries(camposObrigatorios)) {
      if (!formData[campo]) {
        console.log(`Campo obrigatório não preenchido: ${campo}`);
        Alert.alert("Erro", `Por favor, preencha o campo ${nome}`);
        return false;
      }
    }

    if (formData.senha !== formData.confirmarSenha) {
      console.log("Senhas não coincidem");
      Alert.alert("Erro", "As senhas não coincidem");
      return false;
    }

    if (!termsAccepted) {
      console.log("Termos não aceitos");
      Alert.alert("Erro", "Você precisa aceitar os termos e condições");
      return false;
    }

    console.log("Formulário validado com sucesso!");
    return true;
  };

  // Buscar endereço pelo CEP
  const buscarCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    try {
      setLoading(true);
      const response = await axios.get(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );

      if (response.data && !response.data.erro) {
        setFormData((prev) => ({
          ...prev,
          endereco: response.data.logradouro || prev.endereco,
          bairro: response.data.bairro || prev.bairro,
          cidade: response.data.localidade || prev.cidade,
          estado: response.data.uf || prev.estado,
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      Alert.alert("Erro", "Não foi possível buscar o CEP. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Adicionar debounce para a busca do CEP
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const debouncedBuscarCep = debounce(buscarCep, 1000);

  const handleCepChange = (value) => {
    handleInputChange("cep", value);
    if (value.replace(/\D/g, "").length === 8) {
      debouncedBuscarCep(value);
    }
  };

  const handleRegister = async () => {
    console.log("Iniciando cadastro...");
    console.log("Estado do formulário:", formData);
    console.log("Termos aceitos:", termsAccepted);

    if (!validateForm()) {
      console.log("Validação do formulário falhou");
      return;
    }

    setLoading(true);
    try {
      console.log("Formulário válido, preparando dados...");

      // Formata o endereço completo
      const enderecoCompleto = `${formData.endereco}${
        formData.numero ? `, ${formData.numero}` : ""
      }${formData.complemento ? `, ${formData.complemento}` : ""} - ${
        formData.bairro
      }, ${formData.cidade}/${formData.estado}${
        formData.cep ? ` - CEP: ${formData.cep}` : ""
      }`;

      // Limpa e formata os dados antes de enviar
      const userData = {
        username: formData.email.trim(),
        nome: formData.nome.trim(),
        sobrenome: formData.sobrenome?.trim() || "",
        email: formData.email.trim(),
        senha: formData.senha,
        cpf: formData.cpf.replace(/\D/g, ""),
        rg: formData.rg.replace(/\D/g, ""),
        endereco: enderecoCompleto.trim(),
        role: "USER",
      };

      console.log("Dados formatados:", userData);

      // Verifica se o usuário já existe
      console.log("Verificando se usuário já existe...");
      const existingUser = await UsuarioApi.getUserByUsername(
        userData.username
      );
      if (existingUser && existingUser.data) {
        console.log("Usuário já existe");
        Alert.alert("Erro", "Este e-mail já está cadastrado");
        setLoading(false);
        return;
      }

      console.log("Tentando criar usuário...");
      const response = await UsuarioApi.create(userData);
      console.log("Resposta da API:", response);

      if (response.status === 201 && response.data) {
        console.log("Usuário criado com sucesso");
        // Limpa o formulário
        setFormData({
          nome: "",
          sobrenome: "",
          email: "",
          senha: "",
          confirmarSenha: "",
          cpf: "",
          rg: "",
          endereco: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          estado: "",
          cep: "",
          role: "USER",
        });

        Alert.alert("Sucesso", "Cadastro realizado com sucesso!", [
          {
            text: "OK",
            onPress: () => {
              console.log("Redirecionando para Login...");
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Erro detalhado ao cadastrar:", error);
      console.error("Resposta do erro:", error.response?.data);
      console.error("Status do erro:", error.response?.status);

      let errorMessage = "Erro ao realizar cadastro. Tente novamente.";

      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = "Dados inválidos. Verifique as informações.";
        } else if (error.response.status === 409) {
          errorMessage = "Este e-mail ou usuário já está cadastrado.";
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }

      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Header navigation={navigation} />

        <View style={[styles.container, { padding: isLargeScreen ? 40 : 20 }]}>
          <Text style={styles.title}>Cadastro</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginText}>Já tem conta? Login</Text>
          </TouchableOpacity>

          <View style={styles.formContainer}>
            {/* Nome e Sobrenome */}
            <View
              style={[
                styles.section,
                { flexDirection: isLargeScreen ? "row" : "column" },
              ]}
            >
              <View
                style={[styles.inputGroup, { flex: isLargeScreen ? 1 : 1 }]}
              >
                <Text style={styles.label}>NOME*</Text>
                <MaskInput
                  style={styles.input}
                  placeholder="Seu nome"
                  value={formData.nome}
                  onChangeText={(text) => handleInputChange("nome", text)}
                />
              </View>
              <View
                style={[styles.inputGroup, { flex: isLargeScreen ? 1 : 1 }]}
              >
                <Text style={styles.label}>SOBRENOME</Text>
                <MaskInput
                  style={styles.input}
                  placeholder="Seu sobrenome"
                  value={formData.sobrenome}
                  onChangeText={(text) => handleInputChange("sobrenome", text)}
                />
              </View>
            </View>

            {/* CPF e RG */}
            <View
              style={[
                styles.section,
                { flexDirection: isLargeScreen ? "row" : "column" },
              ]}
            >
              <View
                style={[styles.inputGroup, { flex: isLargeScreen ? 1 : 1 }]}
              >
                <Text style={styles.label}>CPF*</Text>
                <MaskInput
                  style={styles.input}
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChangeText={(masked, unmasked) =>
                    handleInputChange("cpf", masked)
                  }
                  mask={Masks.BRL_CPF}
                  keyboardType="numeric"
                />
              </View>
              <View
                style={[styles.inputGroup, { flex: isLargeScreen ? 1 : 1 }]}
              >
                <Text style={styles.label}>RG*</Text>
                <MaskInput
                  style={styles.input}
                  placeholder="00.000.000-0"
                  value={formData.rg}
                  onChangeText={(masked, unmasked) =>
                    handleInputChange("rg", masked)
                  }
                  mask={[
                    /\d/,
                    /\d/,
                    ".",
                    /\d/,
                    /\d/,
                    /\d/,
                    ".",
                    /\d/,
                    /\d/,
                    /\d/,
                    "-",
                    /[\dXx]/,
                  ]}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.section}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>EMAIL*</Text>
                <MaskInput
                  style={styles.input}
                  placeholder="nome@exemplo.com"
                  value={formData.email}
                  onChangeText={(text) => handleInputChange("email", text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* CEP */}
            <View style={styles.section}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>CEP</Text>
                <MaskInput
                  style={styles.input}
                  value={formData.cep}
                  onChangeText={handleCepChange}
                  mask={Masks.ZIP_CODE}
                  keyboardType="numeric"
                  placeholder="00000-000"
                />
              </View>
            </View>

            {/* Endereço e Número */}
            <View
              style={[
                styles.section,
                { flexDirection: isLargeScreen ? "row" : "column" },
              ]}
            >
              <View
                style={[styles.inputGroup, { flex: isLargeScreen ? 2 : 1 }]}
              >
                <Text style={styles.label}>ENDEREÇO*</Text>
                <MaskInput
                  style={styles.input}
                  placeholder="Rua, Avenida, etc"
                  value={formData.endereco}
                  onChangeText={(text) => handleInputChange("endereco", text)}
                />
              </View>
              <View
                style={[styles.inputGroup, { flex: isLargeScreen ? 1 : 1 }]}
              >
                <Text style={styles.label}>NÚMERO*</Text>
                <MaskInput
                  style={styles.input}
                  placeholder="Nº"
                  value={formData.numero}
                  onChangeText={(text) => handleInputChange("numero", text)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Complemento e Bairro */}
            <View
              style={[
                styles.section,
                { flexDirection: isLargeScreen ? "row" : "column" },
              ]}
            >
              <View
                style={[styles.inputGroup, { flex: isLargeScreen ? 1 : 1 }]}
              >
                <Text style={styles.label}>COMPLEMENTO</Text>
                <MaskInput
                  style={styles.input}
                  placeholder="Apto, Sala, etc"
                  value={formData.complemento}
                  onChangeText={(text) =>
                    handleInputChange("complemento", text)
                  }
                />
              </View>
              <View
                style={[styles.inputGroup, { flex: isLargeScreen ? 1 : 1 }]}
              >
                <Text style={styles.label}>BAIRRO*</Text>
                <MaskInput
                  style={styles.input}
                  placeholder="Seu bairro"
                  value={formData.bairro}
                  onChangeText={(text) => handleInputChange("bairro", text)}
                />
              </View>
            </View>

            {/* Estado e Cidade */}
            <View
              style={[
                styles.section,
                { flexDirection: isLargeScreen ? "row" : "column" },
              ]}
            >
              <View
                style={[styles.inputGroup, { flex: isLargeScreen ? 1 : 1 }]}
              >
                <Text style={styles.label}>ESTADO*</Text>
                <Picker
                  selectedValue={formData.estado}
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    handleInputChange("estado", itemValue)
                  }
                >
                  <Picker.Item label="Selecione o estado" value="" />
                  {estados.map((estado) => (
                    <Picker.Item
                      key={estado.sigla}
                      label={estado.nome}
                      value={estado.sigla}
                    />
                  ))}
                </Picker>
              </View>
              <View
                style={[styles.inputGroup, { flex: isLargeScreen ? 1 : 1 }]}
              >
                <Text style={styles.label}>CIDADE*</Text>
                <Picker
                  selectedValue={formData.cidade}
                  style={styles.picker}
                  enabled={!loadingCidades}
                  onValueChange={(itemValue) =>
                    handleInputChange("cidade", itemValue)
                  }
                >
                  <Picker.Item
                    label={
                      loadingCidades ? "Carregando..." : "Selecione a cidade"
                    }
                    value=""
                  />
                  {cidades.map((cidade) => (
                    <Picker.Item
                      key={cidade.id}
                      label={cidade.nome}
                      value={cidade.nome}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Senha e Confirmação */}
            <View
              style={[
                styles.section,
                { flexDirection: isLargeScreen ? "row" : "column" },
              ]}
            >
              <View
                style={[styles.inputGroup, { flex: isLargeScreen ? 1 : 1 }]}
              >
                <Text style={styles.label}>SENHA*</Text>
                <MaskInput
                  style={styles.input}
                  placeholder="*****"
                  secureTextEntry={true}
                  value={formData.senha}
                  onChangeText={(text) => handleInputChange("senha", text)}
                />
              </View>
              <View
                style={[styles.inputGroup, { flex: isLargeScreen ? 1 : 1 }]}
              >
                <Text style={styles.label}>CONFIRMAR SENHA*</Text>
                <MaskInput
                  style={styles.input}
                  placeholder="*****"
                  secureTextEntry={true}
                  value={formData.confirmarSenha}
                  onChangeText={(text) =>
                    handleInputChange("confirmarSenha", text)
                  }
                />
              </View>
            </View>

            {/* Termos e condições */}
            <View style={styles.termsContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setTermsAccepted(!termsAccepted)}
              >
                {termsAccepted && <View style={styles.checkboxInner} />}
              </TouchableOpacity>
              <Text style={styles.termsText}>
                Eu aceito os termos e política de privacidade
              </Text>
            </View>

            {/* Botão de cadastro */}
            <TouchableOpacity
              style={[styles.registerButton, loading && styles.disabledButton]}
              onPress={() => {
                console.log("Botão de cadastro pressionado");
                handleRegister();
              }}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>Cadastrar-se</Text>
              )}
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
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingBottom: 30,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  loginText: {
    color: "#648C47",
    textAlign: "center",
    marginBottom: 30,
    textDecorationLine: "underline",
  },
  formContainer: {
    width: "100%",
    maxWidth: 800,
    alignSelf: "center",
  },
  section: {
    marginBottom: 20,
    gap: 15,
  },
  inputGroup: {
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 3,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: "#648C47",
    borderRadius: 2,
  },
  termsText: {
    fontSize: 14,
  },
  registerButton: {
    backgroundColor: "#648C47",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 12,
    backgroundColor: "#fff",
  },
});

export default Register;
