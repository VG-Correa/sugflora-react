import React from 'react';
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

const NewField = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Cabeçalho igual ao da HomePage */}
      <View style={styles.headerContainer}>
        <Image 
          source={require('../assets/images/cabecalho.jpg')} 
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
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('HomePage')}
            >
              <Text style={styles.menuText}>PÁGINA INICIAL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>SOBRE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>CONTATO</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>SAIR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{paddingBottom: 30}}>
        <Text style={styles.pageTitle}>ADICIONAR CAMPO</Text>

        {/* Campos grandes: Nome, Descrição, Localização */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>NOME DO CAMPO</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do campo"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>DESCRIÇÃO</Text>
          <TextInput
            style={[styles.input, {height: 100}]}
            placeholder="Descrição do campo"
            multiline
          />
        </View>

        {/* Datas lado a lado */}
        <View style={styles.rowFields}>
          <View style={[styles.fieldGroup, styles.smallField]}>
            <Text style={styles.fieldLabel}>DATA DE INÍCIO</Text>
            <TextInput
              style={styles.input}
              placeholder="dd/mm/aaaa"
            />
          </View>

          <View style={[styles.fieldGroup, styles.smallField]}>
            <Text style={styles.fieldLabel}>PREVISÃO DE CONCLUSÃO</Text>
            <TextInput
              style={styles.input}
              placeholder="dd/mm/aaaa"
            />
          </View>
        </View>

        {/* Localização: País, Estado, Cidade, Endereço */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>PAÍS</Text>
          <TextInput
            style={styles.input}
            placeholder="Brasil"
            editable={false}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>ESTADO</Text>
          <TextInput
            style={styles.input}
            placeholder="SP"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>CIDADE</Text>
          <TextInput
            style={styles.input}
            placeholder="Ferraz de Vasconcelos"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>ENDEREÇO</Text>
          <TextInput
            style={styles.input}
            placeholder="Rua Exemplo, 123"
          />
        </View>

        {/* Botão salvar */}
        <TouchableOpacity style={styles.createButton}>
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
  // Estilos do cabeçalho (iguais ao da HomePage)
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