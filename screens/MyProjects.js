import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';

const MyProjects = () => {
  const navigation = useNavigation();
  
  const [projetos, setProjetos] = useState([])

  

  return (
    <View style={styles.container}>
      {/* Cabeçalho igual ao da HomePage */}
      <Header navigation={navigation}/>

      <View style={styles.content}>
        <Text style={styles.pageTitle}>MEUS PROJETOS</Text>
        
        {/* Container do projeto */}
        <View style={styles.projectContainer}>
          <Text style={styles.projectHeader}>Projeto Exemplo</Text>
          
          {/* Área para foto */}
          <View style={styles.photoContainer}>
            <Image 
              source={require('../assets/images/sem-imagem.png')} 
              style={styles.projectImage}
              resizeMode="cover"
            />
          </View>
          
          {/* Situação */}
          <Text style={styles.label}>Situação</Text>
          <TextInput
            style={styles.inputField}
            editable={false}
            value="Em andamento"
          />
          
          {/* Campos */}
          <Text style={styles.label}>Campos</Text>
          <TextInput
            style={styles.inputField}
            editable={false}
            value="5 campos registrados"
          />
          
          {/* Coletas */}
          <Text style={styles.label}>Coletas</Text>
          <TextInput
            style={styles.inputField}
            editable={false}
            value="12 coletas realizadas"
          />
          
          {/* Botão Abrir Projeto */}
          <TouchableOpacity style={styles.openButton}>
            <Text style={styles.buttonText}>Abrir Projeto</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    // textShadowColor: 'rgba(0,0,0,0.8)',
    // textShadowOffset: {width: 1, height: 1},
    // textShadowRadius: 5,
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
    // textShadowColor: 'rgba(0,0,0,0.8)',
    // textShadowOffset: {width: 1, height: 1},
    // textShadowRadius: 5,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 20,
    textAlign: 'center',
  },
  projectContainer: {
    width: '80%',
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    padding: 15,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    elevation: 3,
  },
  projectHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 15,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  projectImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 5,
  },
  inputField: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: '#333',
  },
  openButton: {
    backgroundColor: '#2e7d32',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default MyProjects;