import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import CampoApi from '../functions/api/CampoApi';
import HeaderInterno from '../components/HeaderInterno';
import AsyncStorage from '@react-native-async-storage/async-storage';


const NewField = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { projeto } = route.params;

  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [descricao, setDescricao] = useState('');
  const [pais, setPais] = useState('Brasil'); 
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [endereco, setEndereco] = useState('');
  const [previsaoConclusao, setPrevisaoConclusao] = useState(''); 

  const validarCampos = () => {
    if (!nome || !dataInicio || !pais || !estado || !cidade || !endereco) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos marcados com *');
      return false;
    }
    return true;
  };

  const formatDateToISO = (dateStr) => {
    if (!dateStr || !dateStr.includes('/')) return null;
    const [day, month, year] = dateStr.split('/');
    if (day && month && year && year.length === 4) {
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00`;
    }
    return null; 
  };


  const handleSubmit = async () => {
    if (!projeto?.id) {
      Alert.alert("Erro", "ID do projeto não encontrado. Volte e tente novamente.");
      return;
    }

    if (!validarCampos()) {
      return;
    }

    setLoading(true);

    try {
      const userId = await AsyncStorage.getItem("user_id");
      const inicioISO = formatDateToISO(dataInicio);
      const terminoISO = formatDateToISO(previsaoConclusao);

      
      if (!inicioISO) {
        Alert.alert(
          "Formato de Data Inválido",
          "Por favor, insira a Data de Início no formato dd/mm/aaaa."
        );
        setLoading(false); 
        return; 
      }

      const campoJson = {
        id: null,
        usuario_responsavel_uuid: userId,
        projeto_id: projeto.id,
        nome,
        descricao,
        endereco,
        cidade,
        estado,
        pais,
        data_inicio: inicioISO,
        data_termino: terminoISO,
        cep: ""
      };

      console.log('Payload sendo enviado:', campoJson);

      const response = await CampoApi.create(campoJson);

      if (response.status === 201) {
        Alert.alert('Sucesso!', 'Novo campo cadastrado com sucesso!');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Erro ao criar campo:', error.response?.data || error);
      Alert.alert('Erro', 'Não foi possível criar o campo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderInterno />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.formWrapper}
      >
        <Text style={styles.pageTitle}>ADICIONAR CAMPO</Text>

        <View style={styles.row}>
          <View style={styles.fieldGroupHalf}>
            <Text style={styles.fieldLabel}>NOME DO CAMPO</Text>
            <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
          </View>
          <View style={styles.fieldGroupHalf}>
            <Text style={styles.fieldLabel}>DATA DE INÍCIO</Text>
            <TextInput style={styles.input} placeholder="dd/mm/aaaa" value={dataInicio} onChangeText={setDataInicio} />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>DESCRIÇÃO</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Digite aqui"
            multiline
            value={descricao}
            onChangeText={setDescricao}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.fieldGroupThird}>
            <Text style={styles.fieldLabel}>PAÍS</Text>
            <TextInput style={styles.input} value={pais} onChangeText={setPais} editable={false} />
          </View>
          <View style={styles.fieldGroupThird}>
            <Text style={styles.fieldLabel}>ESTADO</Text>
            <TextInput style={styles.input} placeholder="Ex: SP" value={estado} onChangeText={setEstado} />
          </View>
          <View style={styles.fieldGroupThird}>
            <Text style={styles.fieldLabel}>CIDADE</Text>
            <TextInput style={styles.input} placeholder="Ex: São Paulo" value={cidade} onChangeText={setCidade} />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.fieldGroupHalf}>
            <Text style={styles.fieldLabel}>ENDEREÇO</Text>
            <TextInput style={styles.input} placeholder="Rua, número, bairro" value={endereco} onChangeText={setEndereco} />
          </View>
          <View style={styles.fieldGroupHalf}>
            <Text style={styles.fieldLabel}>PREVISÃO DE CONCLUSÃO</Text>
            <TextInput style={styles.input} placeholder="dd/mm/aaaa" value={previsaoConclusao} onChangeText={setPrevisaoConclusao} />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.createButton, loading && styles.createButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.createButtonText}>{loading ? 'SALVANDO...' : 'Salvar Campo'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F8F4' },
  content: { flex: 1 },
  formWrapper: { paddingHorizontal: 30, paddingVertical: 20 },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 30,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  fieldGroup: {
    marginBottom: 15,
  },
  fieldGroupHalf: {
    width: '48%',
  },
  fieldGroupThird: {
    width: '31%',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 45,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  createButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 15,
    borderRadius: 8,
    width: '50%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  createButtonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default NewField;