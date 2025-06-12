import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import projetoApi from '../functions/api/projetoApi';
import * as FileSystem from 'expo-file-system';
import HeaderInterno from '../components/HeaderInterno'; // Mantendo o header interno padrão

const EditProject = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { projeto } = route.params;

  // Função para formatar a data vinda da API (Array) para o input (dd/mm/aaaa)
  const formatDateFromArrayForInput = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 3) {
      return ''; // Retorna string vazia se o formato for inválido
    }
    const [ano, mes, dia] = dateArray;
    const diaFormatado = String(dia).padStart(2, '0');
    const mesFormatado = String(mes).padStart(2, '0');
    return `${diaFormatado}/${mesFormatado}/${ano}`;
  };

  const [nome, setNome] = useState(projeto.nome || '');
  const [descricao, setDescricao] = useState(projeto.descricao || '');
  const [dataInicio, setDataInicio] = useState(formatDateFromArrayForInput(projeto.inicio));
  const [previsaoConclusao, setPrevisaoConclusao] = useState(formatDateFromArrayForInput(projeto.termino));
  const [responsavel, setResponsavel] = useState(projeto.responsavel || '');
  const [imagemUri, setImagemUri] = useState(projeto.imagemUrl ? projetoApi.baseUrl + projeto.imagemUrl : null);
  const [isNewImage, setIsNewImage] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImagemUri(result.assets[0].uri);
      setIsNewImage(true); // Marca que a imagem é nova
    }
  };

  const validarCampos = () => {
    if (!nome || !descricao || !dataInicio || !previsaoConclusao || !responsavel) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos.');
      return false;
    }
    return true;
  };

  const formatDateToISO = (dateStr) => {
    if (!dateStr || !dateStr.includes('/')) return null;
    const [day, month, year] = dateStr.split('/');
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00`;
  };

  const handleUpdateProject = async () => {
    if (!validarCampos()) return;

    try {
      const userId = await AsyncStorage.getItem('user_id');

      let imagemBase64 = null;
      // Converte para base64 apenas se uma nova imagem foi selecionada
      if (imagemUri && isNewImage) {
        imagemBase64 = await FileSystem.readAsStringAsync(imagemUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      const inicioISO = formatDateToISO(dataInicio);
      const terminoISO = formatDateToISO(previsaoConclusao);

      const payload = {
        id: projeto.id, // ID do projeto que está sendo editado
        nome,
        descricao,
        inicio: inicioISO,
        termino: terminoISO,
        responsavel,
        imagemBase64, // Será nulo se a imagem não for nova
        usuario_dono_uuid: userId,
        isPublic: projeto.isPublic,
      };

      console.log('Payload para API (update):', payload);
      
      const response = await projetoApi.update(payload);
      
      console.log('Resposta da atualização:', response?.status);

      if (response?.status === 200) {
        Alert.alert('Sucesso', 'Projeto atualizado com sucesso!');
        navigation.navigate('MyProjects');
      } else {
        Alert.alert('Erro', `Erro ao salvar o projeto. Status: ${response?.status}`);
      }
    } catch (error) {
      console.error('Erro ao atualizar projeto', error.response?.data || error);
      Alert.alert('Erro', 'Erro ao tentar salvar as alterações do projeto.');
    }
  };

  return (
    <View style={styles.container}>
      <HeaderInterno />

      <ScrollView style={styles.content} contentContainerStyle={styles.formWrapper}>
        <Text style={styles.pageTitle}>EDITAR PROJETO</Text>

        <View style={styles.row}>
          <View style={styles.imageSection}>
            <Text style={styles.photoLabel}>Imagem</Text>
            {imagemUri ? (
              <Image source={{ uri: imagemUri }} style={styles.photoPreview} />
            ) : (
              <View style={styles.photoPlaceholder}></View>
            )}
            <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage}>
              <Text style={styles.changePhotoText}>Alterar imagem</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.fieldsSection}>
            <View style={styles.doubleFieldRow}>
              <View style={styles.fieldGroupHalf}>
                <Text style={styles.fieldLabel}>NOME DO PROJETO</Text>
                <TextInput style={styles.input} value={nome} onChangeText={setNome} />
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
                multiline
                value={descricao}
                onChangeText={setDescricao}
              />
            </View>

            <View style={styles.doubleFieldRow}>
              <View style={styles.fieldGroupHalf}>
                <Text style={styles.fieldLabel}>PREVISÃO DE CONCLUSÃO</Text>
                <TextInput style={styles.input} placeholder="dd/mm/aaaa" value={previsaoConclusao} onChangeText={setPrevisaoConclusao} />
              </View>
              <View style={styles.fieldGroupHalf}>
                <Text style={styles.fieldLabel}>RESPONSÁVEL</Text>
                <TextInput style={styles.input} value={responsavel} onChangeText={setResponsavel} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.createButton} onPress={handleUpdateProject}>
            <Text style={styles.createButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// Estilos copiados da tela NewProject para consistência visual
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1 },
  formWrapper: { padding: 20 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#2e7d32' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  imageSection: { width: '30%', alignItems: 'center' },
  photoLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#2e7d32' },
  photoPlaceholder: { width: 100, height: 100, borderRadius: 5, backgroundColor: '#e8f5e9', marginBottom: 10 },
  photoPreview: { width: 100, height: 100, borderRadius: 5, marginBottom: 10 },
  changePhotoButton: { backgroundColor: '#2e7d32', padding: 8, borderRadius: 5 },
  changePhotoText: { color: '#fff', fontSize: 12 },
  fieldsSection: { width: '65%' },
  fieldGroup: { marginBottom: 15 },
  fieldGroupHalf: { flex: 1, marginEnd: 10 },
  doubleFieldRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  fieldLabel: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, color: '#2e7d32' },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: { alignItems: 'center', marginTop: 20 },
  createButton: { backgroundColor: '#2e7d32', padding: 15, borderRadius: 5, width: 200, alignItems: 'center' },
  createButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default EditProject;