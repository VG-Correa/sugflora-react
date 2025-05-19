import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import projetoApi from '../functions/api/projetoApi';
import { Header } from '../components/Header';

const MyProjects = () => {
  const [projetos, setProjetos] = useState([])
  const navigation = useNavigation();

  async function fetchProjetos() {
    const user_id = localStorage.getItem('user_id')
    const response = await projetoApi.getProjetos(user_id);

    if (response.status === 200) {
      setProjetos(response.data.data)
      console.log("Response: ", response.data.data)
    } else {
      alert("Erro ao carregar projetos")
    }
  }

  useEffect(async () => {
    await fetchProjetos()
  }, [])


  return (
    <View style={styles.container}>
      {/* Cabeçalho igual ao da HomePage */}
      <View style={styles.headerContainer}>
        <Image 
          source={require('../assets/images/cabecalho.webp')} 
          style={styles.headerBackgroundImage}
          resizeMode="cover"
        />
        <View style={styles.headerContent}>
          <Image 
            source={require('../assets/images/logo.webp')}
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

      <View style={styles.content}>
        <Text style={styles.pageTitle}>MEUS PROJETOS</Text>

        {/* Container do projeto */}
        <View style={styles.container_projetos}>
          {
            projetos.map(projeto => (
              <View style={styles.projectContainer}>
                <Text style={styles.projectHeader}>{projeto.nome}</Text>

                {/* Área para foto */}
                {/* <View style={styles.photoContainer}>
                  <Image
                    source={require('../assets/images/sem-imagem.png')}
                    style={styles.projectImage}
                    resizeMode="cover"
                  />
                </View> */}

                {/* Situação */}
                {/* <Text style={styles.label}>{"Público" ? projeto.deleted : "Privado"}</Text> */}
                <TextInput
                  style={styles.inputField}
                  editable={false}
                  value={projeto.deleted ? "Publicado" : "Privado"}
                />

                {/* Campos */}
                {/* <Text style={styles.label}>Campos</Text>
                <TextInput
                  style={styles.inputField}
                  editable={false}
                  value="5 campos registrados"
                /> */}

                {/* Coletas */}
                {/* <Text style={styles.label}>Coletas</Text>
                <TextInput
                  style={styles.inputField}
                  editable={false}
                  value="12 coletas realizadas"
                /> */}

                {/* Botão Abrir Projeto */}
                <TouchableOpacity
                  style={styles.openButton}
                  onPress={() => navigation.navigate('ProjectScreen', { projeto: projeto })}
                >
                  <Text style={styles.buttonText}>Abrir Projeto</Text>
                </TouchableOpacity>
              </View>
            ))
          }

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
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
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
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
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
    width: 'auto',
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  container_projetos: {
    width: '100% !important',
    height: '100% !important',
    display: 'flex !important',
    flexWrap: 'wrap !important',
    flexDirection: 'row',
    gap: 10,
    justifyContent: "space-around !important",
    alignContent: 'space-around !important',
    alignItems: 'center !important',
  }
});

export default MyProjects;