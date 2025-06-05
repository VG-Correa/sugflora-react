import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView
  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderInterno from '../components/HeaderInterno';
import FamiliaApi from '../functions/api/FamiliaApi';
import CustomPicker from '../components/CustomPicker';


const AddCollection = () => {
  const navigation = useNavigation();

  const [familias, setFamilias] = useState([])
  const [generos, setGeneros] = useState([])
  const [especies, setEspecies] = useState([])

  const [familia, setFamilia] = useState(null);
  const [genero, setGenero] = useState(null);
  const [especie, setEspecie] = useState(null);

  useEffect(() => {
    const fetchFamilias = async () => {
      try {
        const response = await FamiliaApi.getAll()
        setFamilias(response.data.data)
      } catch (error) {
        window.alert("Erro ao carregar familias: ", error.response.data.message)
      }
    }
  }, [])


  return (
    <View style={styles.container}>
      <HeaderInterno />

      <ScrollView style={styles.content} contentContainerStyle={{paddingBottom: 30}}>
        <Text style={styles.pageTitle}>ADICIONAR COLETA</Text>

        {/* Nome do campo */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>NOME DO CAMPO</Text>
          <TextInput
            style={styles.input}
            placeholder="Campo 1"
          />
        </View>

        {/* Família */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>FAMÍLIA</Text>
          
          <CustomPicker 
            items={familias.map(f => ({id: f.id, valor: f.nome}))}
            defaultValue={familia?.id}
            onChange={(item) => setFamilia(item)}
            placeholder='Não identificado...'
          />
        </View>

        {/* Data da coleta */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>DATA DA COLETA</Text>
          <TextInput
            style={styles.input}
            placeholder="dd/mm/aa"
          />
        </View>

        {/* Nome da espécie */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>NOME DA ESPÉCIE</Text>
          <TextInput
            style={styles.input}
            placeholder="Insira aqui"
          />
        </View>

        {/* Gênero e Espécie lado a lado */}
        <View style={styles.rowFields}>
          <View style={[styles.fieldGroup, styles.smallField]}>
            <Text style={styles.fieldLabel}>GÊNERO</Text>
            <TextInput
              style={styles.input}
              placeholder="Escolher"
              editable={false}
            />
          </View>

          <View style={[styles.fieldGroup, styles.smallField]}>
            <Text style={styles.fieldLabel}>ESPÉCIE</Text>
            <TextInput
              style={styles.input}
              placeholder="Escolher"
              editable={false}
            />
          </View>
        </View>

        {/* Sistema de correspondência - movido para o final */}
        <View style={styles.divider}>
          <Text style={styles.dividerText}>SISTEMA DE CORRESPONDÊNCIA DE ESPÉCIES</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>SUGESTÃO DE CORRESPONDÊNCIA</Text>
          <View style={styles.percentageBox}>
            <Text style={styles.percentageNumber}>87</Text>
            <Text style={styles.percentageSymbol}>%</Text>
          </View>
        </View>

        {/* Botão voltar */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>VOLTAR</Text>
        </TouchableOpacity>

        {/* Botão salvar */}
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>SALVAR COLETA</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  headerContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
  },
  headerBackgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  headerContent: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    paddingTop: 20,
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: 5,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 5,
    marginBottom: 15,
  },
  menuTop: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 10,
  },
  menuItem: {
    paddingHorizontal: 10,
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#2e7d32',
  },
  fieldGroup: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2e7d32',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  rowFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallField: {
    width: '48%',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 20,
    alignItems: 'center',
    paddingBottom: 10,
  },
  dividerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
  },
  percentageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#f1f8f2',
  },
  percentageNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  percentageSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginLeft: 4,
  },
  backButton: {
    backgroundColor: '#888',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  createButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default AddCollection;
