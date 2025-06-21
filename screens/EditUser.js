import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUsuarioData } from "../data/usuarios/UsuarioDataContext";

const EditUser = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { getUsuarioById, updateUsuario } = useUsuarioData();

  // Referências para os campos
  const nomeRef = useRef(null);
  const emailRef = useRef(null);
  const cpfRef = useRef(null);
  const telefoneRef = useRef(null);
  const dataNascimentoRef = useRef(null);
  const enderecoRef = useRef(null);
  const cidadeRef = useRef(null);
  const estadoRef = useRef(null);
  const cepRef = useRef(null);
  const cargoRef = useRef(null);
  const departamentoRef = useRef(null);
  const matriculaRef = useRef(null);
  const dataAdmissaoRef = useRef(null);
  const dataDemissaoRef = useRef(null);
  const statusRef = useRef(null);
  const tipoContratoRef = useRef(null);
  const jornadaTrabalhoRef = useRef(null);
  const salarioRef = useRef(null);
  const bancoRef = useRef(null);
  const agenciaRef = useRef(null);
  const contaRef = useRef(null);
  const tipoContaRef = useRef(null);
  const pixRef = useRef(null);
  const tipoPixRef = useRef(null);
  const observacoesRef = useRef(null);

  useEffect(() => {
    carregarUsuario();
  }, []);

  const carregarUsuario = async () => {
    try {
      const user_id = await AsyncStorage.getItem("user_id");
      if (!user_id) {
        setError("Usuário não identificado");
        return;
      }

      const userData = getUsuarioById(parseInt(user_id));
      setUser(userData);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const salvarAlteracoes = async () => {
    try {
      if (!user?.id) {
        Alert.alert("Erro", "Usuário não identificado");
        return;
      }

      // Construir objeto com as alterações
      const userJson = {
        id: user.id,
        nome: nomeRef.current?.value?.trim(),
        email: emailRef.current?.value?.trim(),
        cpf: cpfRef.current?.value?.trim(),
        telefone: telefoneRef.current?.value?.trim(),
        data_nascimento: dataNascimentoRef.current?.value?.trim(),
        endereco: enderecoRef.current?.value?.trim(),
        cidade: cidadeRef.current?.value?.trim(),
        estado: estadoRef.current?.value?.trim(),
        cep: cepRef.current?.value?.trim(),
        cargo: cargoRef.current?.value?.trim(),
        departamento: departamentoRef.current?.value?.trim(),
        matricula: matriculaRef.current?.value?.trim(),
        data_admissao: dataAdmissaoRef.current?.value?.trim(),
        data_demissao: dataDemissaoRef.current?.value?.trim(),
        status: statusRef.current?.value?.trim(),
        tipo_contrato: tipoContratoRef.current?.value?.trim(),
        jornada_trabalho: jornadaTrabalhoRef.current?.value?.trim(),
        salario: salarioRef.current?.value?.trim(),
        banco: bancoRef.current?.value?.trim(),
        agencia: agenciaRef.current?.value?.trim(),
        conta: contaRef.current?.value?.trim(),
        tipo_conta: tipoContaRef.current?.value?.trim(),
        pix: pixRef.current?.value?.trim(),
        tipo_pix: tipoPixRef.current?.value?.trim(),
        observacoes: observacoesRef.current?.value?.trim(),
        updated_at: new Date().toISOString(),
      };

      // Validar campos obrigatórios
      if (!userJson.nome || !userJson.email || !userJson.cpf) {
        Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios");
        return;
      }

      const response = await updateUsuario(userJson);
      if (response.status === 200) {
        Alert.alert("Sucesso", "Dados atualizados com sucesso!");
        navigation.goBack();
      } else {
        throw new Error(response.message || "Erro ao atualizar dados");
      }
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      Alert.alert(
        "Erro",
        error.message || "Não foi possível salvar as alterações"
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Editar Perfil</Text>

          {/* Dados Pessoais */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dados Pessoais</Text>
            <TextInput
              ref={nomeRef}
              style={styles.input}
              placeholder="Nome Completo *"
              defaultValue={user?.nome}
            />
            <TextInput
              ref={emailRef}
              style={styles.input}
              placeholder="Email *"
              defaultValue={user?.email}
              keyboardType="email-address"
            />
            <TextInput
              ref={cpfRef}
              style={styles.input}
              placeholder="CPF *"
              defaultValue={user?.cpf}
              keyboardType="numeric"
            />
            <TextInput
              ref={telefoneRef}
              style={styles.input}
              placeholder="Telefone"
              defaultValue={user?.telefone}
              keyboardType="phone-pad"
            />
            <TextInput
              ref={dataNascimentoRef}
              style={styles.input}
              placeholder="Data de Nascimento"
              defaultValue={user?.data_nascimento}
            />
          </View>

          {/* Endereço */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Endereço</Text>
            <TextInput
              ref={enderecoRef}
              style={styles.input}
              placeholder="Endereço"
              defaultValue={user?.endereco}
            />
            <TextInput
              ref={cidadeRef}
              style={styles.input}
              placeholder="Cidade"
              defaultValue={user?.cidade}
            />
            <TextInput
              ref={estadoRef}
              style={styles.input}
              placeholder="Estado"
              defaultValue={user?.estado}
            />
            <TextInput
              ref={cepRef}
              style={styles.input}
              placeholder="CEP"
              defaultValue={user?.cep}
              keyboardType="numeric"
            />
          </View>

          {/* Dados Profissionais */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dados Profissionais</Text>
            <TextInput
              ref={cargoRef}
              style={styles.input}
              placeholder="Cargo"
              defaultValue={user?.cargo}
            />
            <TextInput
              ref={departamentoRef}
              style={styles.input}
              placeholder="Departamento"
              defaultValue={user?.departamento}
            />
            <TextInput
              ref={matriculaRef}
              style={styles.input}
              placeholder="Matrícula"
              defaultValue={user?.matricula}
            />
            <TextInput
              ref={dataAdmissaoRef}
              style={styles.input}
              placeholder="Data de Admissão"
              defaultValue={user?.data_admissao}
            />
            <TextInput
              ref={dataDemissaoRef}
              style={styles.input}
              placeholder="Data de Demissão"
              defaultValue={user?.data_demissao}
            />
            <TextInput
              ref={statusRef}
              style={styles.input}
              placeholder="Status"
              defaultValue={user?.status}
            />
            <TextInput
              ref={tipoContratoRef}
              style={styles.input}
              placeholder="Tipo de Contrato"
              defaultValue={user?.tipo_contrato}
            />
            <TextInput
              ref={jornadaTrabalhoRef}
              style={styles.input}
              placeholder="Jornada de Trabalho"
              defaultValue={user?.jornada_trabalho}
            />
            <TextInput
              ref={salarioRef}
              style={styles.input}
              placeholder="Salário"
              defaultValue={user?.salario}
              keyboardType="numeric"
            />
          </View>

          {/* Dados Bancários */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dados Bancários</Text>
            <TextInput
              ref={bancoRef}
              style={styles.input}
              placeholder="Banco"
              defaultValue={user?.banco}
            />
            <TextInput
              ref={agenciaRef}
              style={styles.input}
              placeholder="Agência"
              defaultValue={user?.agencia}
            />
            <TextInput
              ref={contaRef}
              style={styles.input}
              placeholder="Conta"
              defaultValue={user?.conta}
            />
            <TextInput
              ref={tipoContaRef}
              style={styles.input}
              placeholder="Tipo de Conta"
              defaultValue={user?.tipo_conta}
            />
            <TextInput
              ref={pixRef}
              style={styles.input}
              placeholder="Chave PIX"
              defaultValue={user?.pix}
            />
            <TextInput
              ref={tipoPixRef}
              style={styles.input}
              placeholder="Tipo de PIX"
              defaultValue={user?.tipo_pix}
            />
          </View>

          {/* Observações */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observações</Text>
            <TextInput
              ref={observacoesRef}
              style={[styles.input, styles.textArea]}
              placeholder="Observações"
              defaultValue={user?.observacoes}
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={salvarAlteracoes}>
            <Text style={styles.buttonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  input: {
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    margin: 20,
  },
});

export default EditUser;
