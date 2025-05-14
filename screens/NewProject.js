import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NewProject = () => {
  const navigation = useNavigation(); 

  return (
    <View style={styles.container}>
      {/* Cabeçalho igual ao da HomePage */}
      <View style={styles.headerContainer}>
        <Image 
          source={require('../assets/images/cabecalho.png')} 
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

      <ScrollView style={styles.content}>
        <Text style={styles.pageTitle}>CRIAR PROJETO</Text>
        
        <View style={styles.profileSection}>
          {/* Seção Foto à esquerda */}
          <View style={styles.photoSection}>
            <Text style={styles.photoLabel}>IMAGEM</Text>
            <View style={styles.photoPlaceholder}></View>
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Adicionar imagem</Text>
            </TouchableOpacity>
          </View>
          
          {/* Dados do projeto à direita */}
          <View style={styles.dataSection}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>NOME DO PROJETO</Text>
              <TextInput
                style={styles.input}
                placeholder=""
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>DESCRIÇÃO</Text>
              <TextInput
                style={[styles.input, {height: 100}]}
                placeholder="Digite aqui"
                multiline
              />
            </View>
          </View>
        </View>

        {/* Seção de datas e responsável */}
        <View style={styles.bottomSection}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>DATA DE INÍCIO</Text>
            <TextInput
              style={styles.input}
              placeholder="dd/mm/aa"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>PREVISÃO DE CONCLUSÃO</Text>
            <TextInput
              style={styles.input}
              placeholder="dd/mm/aa"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>RESPONSÁVEL</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do Responsável"
            />
          </View>

          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.createButtonText}>CRIAR PROJETO</Text>
          </TouchableOpacity>
        </View>
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
    color: '#fff'
  },
  content: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#2e7d32',
  },
  profileSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  photoSection: {
    width: '30%',
    alignItems: 'center',
    marginRight: 20,
  },
  photoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2e7d32',
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#e8f5e9',
    marginBottom: 10,
  },
  changePhotoButton: {
    backgroundColor: '#2e7d32',
    padding: 8,
    borderRadius: 5,
  },
  changePhotoText: {
    color: '#fff',
    fontSize: 12,
  },
  dataSection: {
    flex: 1,
  },
  bottomSection: {
    paddingHorizontal: 20,
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

export default NewProject;