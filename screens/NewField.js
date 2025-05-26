import { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import CampoApi from '../functions/api/CampoApi';
import HeaderInterno from "../components/HeaderInterno";



const NewField = () => {
  const navigation = useNavigation();
  const router = useRoute();

  const { projeto } = router.params
  const user_id = localStorage.getItem('user_id')

  const nomeRef = useRef()
  const descricaoRef = useRef()
  const enderecoRef = useRef()
  const cidadeRef = useRef()
  const estadoRef = useRef()
  const paisRef = useRef("Brasil")
  const cepRef = useRef()

  async function salvarCampo() {
    const campoJson = {
      "id": null,
      "usuario_responsavel_uuid": user_id,
      "projeto_id": projeto.id,
      "nome": nomeRef.current.value,
      "descricao": descricaoRef.current.value,
      "endereco": enderecoRef.current.value,
      "cidade": cidadeRef.current.value,
      "estado": estadoRef.current.value,
      "pais": paisRef.current.value,
      "cep": cepRef.current.value
    }

    try {

      const response = await CampoApi.create(campoJson)
      if (response.status === 200) {
        window.alert("Campo criado com sucesso")
        console.log("Campo criado com sucesso", response.data.data)
      } else {
        window.alert("Erro ao criar campo")
        console.log("Erro ao criar campo", response.data.data)
      }

    } catch (error) {
      console.error("Erro ao fazer POST do Campo")
    }

    console.log("Campo: ", campoJson)
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho igual ao da HomePage */}
          <HeaderInterno />


      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 30 }}>
        <Text style={styles.pageTitle}>ADICIONAR CAMPO</Text>

        {/* Campos grandes: Nome, Descrição, Localização */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>NOME DO CAMPO</Text>
          <TextInput ref={nomeRef}
            style={styles.input}
            placeholder="Nome do campo"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>DESCRIÇÃO</Text>
          <TextInput ref={descricaoRef}
            style={[styles.input, { height: 100 }]}
            placeholder="Descrição do campo"
            multiline
          />
        </View>

        {/* Localização: País, Estado, Cidade, Endereço */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>PAÍS</Text>
          <TextInput ref={paisRef}
            style={styles.input}
            placeholder="Brasil"
            editable={false}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>ESTADO</Text>
          <TextInput ref={estadoRef}
            style={styles.input}
            placeholder="SP"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>CIDADE</Text>
          <TextInput ref={cidadeRef}
            style={styles.input}
            placeholder="Ferraz de Vasconcelos"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>ENDEREÇO</Text>
          <TextInput ref={enderecoRef}
            style={styles.input}
            placeholder="Rua Exemplo, 123"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>CEP</Text>
          <TextInput ref={cepRef}
            style={styles.input}
            placeholder=""
          />
        </View>

        {/* Botão salvar */}
        <TouchableOpacity style={styles.createButton} onPress={() => { salvarCampo() }}>
          <Text style={styles.createButtonText}>SALVAR CAMPO</Text>
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
  createButton: {
    backgroundColor: '#2e7d32',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default NewField;