import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import HeaderInterno from '../components/HeaderInterno';
import FamiliaApi from '../functions/api/FamiliaApi';
import GeneroApi from '../functions/api/GeneroApi';
import EspecieApi from '../functions/api/EspecieApi';
import CustomPicker from '../components/CustomPicker';
import ImageSelector from '../components/ImageSelector';
import ColetaApi from '../functions/api/ColetaApi';

const { width } = Dimensions.get('window');

export default function AddCollection() {
  const navigation = useNavigation();
  const route = useRoute();
  const { campo } = route.params;

  const [nomeColeta, setNomeColeta] = useState('');
  const [dataColeta, setDataColeta] = useState('');
  const [familias, setFamilias] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [especies, setEspecies] = useState([]);
  const [familia, setFamilia] = useState(null);
  const [genero, setGenero] = useState(null);
  const [especie, setEspecie] = useState(null);
  const [nomeComum, setNomeComum] = useState('');
  const [images, setImages] = useState([]);

  const toISODate = (ddmmaaaa) => {
    const [dd, mm, yyyy] = ddmmaaaa.split('/');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Função para formatar a data enquanto o usuário digita
  const formatDate = (input) => {
    // Remove tudo que não é dígito
    let cleaned = input.replace(/\D/g, '');

    // Limita o tamanho máximo
    if (cleaned.length > 8) {
      cleaned = cleaned.substring(0, 8);
    }

    // Aplica a formatação
    let formatted = '';
    for (let i = 0; i < cleaned.length; i++) {
      if (i === 2 || i === 4) {
        formatted += '/';
      }
      formatted += cleaned[i];
    }

    return formatted;
  };

  const handleDateChange = (text) => {
    const formatted = formatDate(text);
    setDataColeta(formatted);
  };

  // Carrega famílias
  useEffect(() => {
    (async () => {
      try {
        const res = await FamiliaApi.getAll();
        setFamilias(res.data.data);
      } catch (e) {
        alert('Erro ao carregar famílias');
      }
    })();
  }, []);

  // Carrega gêneros quando família muda
  useEffect(() => {
    const famId = familia?.id;
    if (!famId) {
      setGeneros([]);
      setGenero(null);
      return;
    }

    (async () => {
      try {
        const res = await GeneroApi.getByFamilia(famId);
        setGeneros(res.data.data);
      } catch {
        alert('Erro ao carregar gêneros');
      }
    })();
  }, [familia?.id]);

  // Carrega espécies quando gênero muda
  useEffect(() => {
    const genId = genero?.id;
    if (!genId) {
      setEspecies([]);
      setEspecie(null);
      return;
    }

    (async () => {
      try {
        const res = await EspecieApi.getByGenero(genId);
        setEspecies(res.data.data);
      } catch {
        alert('Erro ao carregar espécies');
      }
    })();
  }, [genero?.id]);

  // Sincroniza família e gênero quando espécie é alterada
  useEffect(() => {
    if (!especie) return;

    if (especie.genero?.id !== genero?.id) {
      setGenero(especie.genero);
    }

    if (especie.genero?.familia?.id !== familia?.id) {
      setFamilia(especie.genero.familia);
    }
  }, [especie]);

  const handleEspecieSelect = (item) => {
    setEspecie(item);
  };

  const saveCollection = async () => {
    // Valida a data antes de enviar
    if (dataColeta && dataColeta.length !== 10) {
      alert('Por favor, insira uma data válida no formato DD/MM/AAAA');
      return;
    }

    const payload = {
      id: null,
      nome: nomeColeta,
      campo_id: campo.id,
      data_coleta: toISODate(dataColeta),
      familia_id: familia?.id,
      genero_id: genero?.id,
      especie_id: especie?.id,
      // imagens: images,
    };

    console.log('Payload:', payload);
    try {
      const response = await ColetaApi.create(payload)
      console.log(response)
    } catch (error) {
      console.log(error);

    }

  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderInterno />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Adicionar Coleta</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome da coleta"
          value={nomeColeta}
          onChangeText={setNomeColeta}
        />

        <TextInput
          style={styles.input}
          placeholder="Data da coleta (DD/MM/AAAA)"
          value={dataColeta}
          onChangeText={handleDateChange}
          keyboardType="numeric"
          maxLength={10} // DD/MM/AAAA tem 10 caracteres
        />

        <CustomPicker
          items={familias.map(f => ({ id: f.id, label: f.nome }))}
          placeholder="Selecione a família"
          searchable
          value={familia?.id}
          onChange={setFamilia}
        />

        <CustomPicker
          items={generos.map(g => ({ id: g.id, label: g.nome }))}
          placeholder="Selecione o gênero"
          searchable
          value={genero?.id}
          onChange={setGenero}
        />

        <CustomPicker
          items={especies.map(e => ({
            id: e.id,
            label: e.nome,
            genero: e.genero,
            familia: e.genero.familia
          }))}
          placeholder="Selecione a espécie"
          searchable
          value={especie?.id}
          onChange={handleEspecieSelect}
        />

        <ImageSelector
          images={images}
          onAddImage={uri => setImages(prev => [...prev, uri])}
          onRemoveImage={uri => setImages(prev => prev.filter(i => i !== uri))}
        />

        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.btnText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={async () => { await saveCollection() }}>
            <Text style={[styles.btnText, { color: '#fff' }]}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '600', textAlign: 'center', marginBottom: 20, color: '#333' },
  input: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  buttonsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  saveBtn: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnText: { fontSize: 16, fontWeight: '500', color: '#333' }
});