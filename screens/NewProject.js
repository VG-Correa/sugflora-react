import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import projetoApi from '../functions/api/projetoApi';
import * as FileSystem from 'expo-file-system';

const API_BASE_URL = 'https://seu-endereco-api.com'; 

const NewProject = () => {
  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [previsaoConclusao, setPrevisaoConclusao] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [imagemUri, setImagemUri] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImagemUri(result.assets[0].uri);
    }
  };

  const validarCampos = () => {
    if (!nome || !descricao || !dataInicio || !previsaoConclusao || !responsavel) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos.');
      return false;
    }
    return true;
  };

  const formatDateOnlyToISO = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const handleCreateProject = async () => {
    if (!validarCampos()) return;

    try {
      const userId = await AsyncStorage.getItem('user_id');

      let imagemBase64 = null;
      if (imagemUri) {
        imagemBase64 = await FileSystem.readAsStringAsync(imagemUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      const dataInicioISO = formatDateOnlyToISO(dataInicio);
      const previsaoConclusaoISO = formatDateOnlyToISO(previsaoConclusao);

      const payload = {
        id: null,
        nome: nome,
        descricao: descricao,
        
        // dataInicio: dataInicioISO,
        // previsaoConclusao: previsaoConclusaoISO,
        
        usuario_dono_uuid: userId,
        isPublic: false,
        // inicioExecucao: null,
        responsavel: responsavel,
        imagemBase64: imagemBase64,
      };
      console.log('Payload para API:', payload);

      const response = await projetoApi.create(payload);

      console.log('Resposta da criação:', response?.status, response?.data);

      if (response?.status === 201) {
        navigation.navigate('MyProjects');
      } else {
        Alert.alert('Erro', 'Erro ao salvar o projeto');
      }
    } catch (error) {
      console.error('Erro ao criar projeto', error);
      Alert.alert('Erro', 'Erro ao tentar salvar projeto');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require('../assets/images/cabecalho.webp')}
          style={styles.headerBackgroundImage}
          resizeMode="cover"
        />
        <View style={styles.headerContent}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>SUG - FLORA</Text>
          <View style={styles.menuTop}>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('MyProjects')}>
              <Text style={styles.menuText}>MEUS PROJETOS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('NewProject')}>
              <Text style={styles.menuText}>CRIAR PROJETO</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('HomePage')}>
              <Text style={styles.menuText}>PÁGINA INICIAL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>SAIR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.formWrapper}>
        <Text style={styles.pageTitle}>CRIAR PROJETO</Text>

        <View style={styles.row}>
          <View style={styles.imageSection}>
            <Text style={styles.photoLabel}>Imagem</Text>
            {imagemUri ? (
              <Image source={{ uri: imagemUri }} style={styles.photoPreview} />
            ) : (
              <View style={styles.photoPlaceholder}></View>
            )}
            <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage}>
              <Text style={styles.changePhotoText}>Adicionar imagem</Text>
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
          <TouchableOpacity style={styles.createButton} onPress={handleCreateProject}>
            <Text style={styles.createButtonText}>Salvar Projeto</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerContainer: { width: '100%', height: 220, position: 'relative' },
  headerBackgroundImage: { width: '100%', height: '100%', position: 'absolute' },
  headerContent: { position: 'absolute', width: '100%', alignItems: 'center', paddingTop: 20 },
  logoImage: { width: 80, height: 80, marginBottom: 5 },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    marginBottom: 15,
  },
  menuTop: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', paddingVertical: 10 },
  menuItem: { paddingHorizontal: 10 },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  content: { flex: 1 },
  formWrapper: { padding: 20 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#2e7d32' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  imageSection: { width: '30%', alignItems: 'center' },
  photoLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#2e7d32' },
  photoPlaceholder: { width: 100, height: 100, backgroundColor: '#e8f5e9', marginBottom: 10 },
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

export default NewProject;
