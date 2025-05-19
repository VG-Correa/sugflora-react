import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderInterno from '../components/HeaderInterno'; // ou o caminho correto

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Cabeçalho (mantido exatamente como estava) */}
      <HeaderInterno />
      <ScrollView style={styles.content}>
        <View style={styles.mainContent}>
          <View style={styles.gridContainer}>
            {/* Linha 1 - Perfil e Projetos (mantido igual) */}
            {/* <View style={styles.gridRow}> */}
              {/* <View style={styles.profileContainer}>
                <Text style={styles.gridTitle}>Meu perfil</Text>
                <Image source={require('../assets/images/1.webp')} style={styles.profileImage} />
                <TextInput
                  style={styles.inputField}
                  editable={false}
                  value="Nome"
                />
                <TextInput
                  style={styles.inputField}
                  editable={false}
                  value="Profissão"
                />
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => navigation.navigate('Profile')}
                >
                  <Text style={styles.buttonText}>Editar perfil</Text>
                </TouchableOpacity>
              </View> */}
              
              
            {/* </View> */}
            
            {/* Linha 2 - Espécies e Flora Match (mantido igual) */}
            <View style={styles.gridRow}>
              {/* <View style={styles.profileContainer}>
                <Text style={styles.gridTitle}>Espécies</Text>
                <Image source={require('../assets/images/3.png')} style={styles.gridImage} />
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.buttonText}>Pesquisar espécie</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.buttonText}>Minhas coletas</Text>
                </TouchableOpacity>
              </View> */}
              <View style={styles.profileContainer}>
                <Text style={styles.gridTitle}>Projetos</Text>
                <Image source={require('../assets/images/2.webp')} style={styles.profileImage} />
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('MyProjects')}
                >
                  <Text style={styles.buttonText}>Meus projetos</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => navigation.navigate('NewProject')}
                >
                  <Text style={styles.buttonText}>Criar projeto</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Linha 2 - Espécies e Flora Match (mantido igual) */}
            <View style={styles.gridRow}>
              <View style={styles.profileContainer}>
                <Text style={styles.gridTitle}>Espécies</Text>
                <Image source={require('../assets/images/3.webp')} style={styles.profileImage} />
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.buttonText}>Pesquisar espécie</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.buttonText}>Minhas coletas</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.profileContainer}>
                <Text style={styles.gridTitle}>Flora Match</Text>
                <Image source={require('../assets/images/4.webp')} style={styles.profileImage} />
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.buttonText}>Ajude-me a identificar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.buttonText}>Eu conheço essa</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* NOVA LINHA - Relatórios (único quadrado alinhado à esquerda)
            <View style={styles.gridRow}>
              <View style={styles.profileContainer}>
                <Text style={styles.gridTitle}>Relatórios</Text>
                <Image source={require('../assets/images/5.webp')} style={styles.profileImage} />
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.buttonText}>Meus relatórios</Text>
                </TouchableOpacity>
              </View>
            </View> */}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// Mantendo TODOS os estilos EXATAMENTE como estavam antes
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
    textAlign: 'justify',
  },
  content: {
    flex: 1,
  },
  mainContent: {
    padding: 15,
  },
  gridContainer: {
    width: '100%',
    // alignContent: 'center',
    // alignItems: 'center'
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  profileContainer: {
    width: '20%',
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    alignItems: 'center',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gridTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 10,
    textAlign: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    resizeMode: 'cover',
  },
  gridImage: {
    width: '80%',
    height: 100,
    resizeMode: 'contain',
    marginBottom: 15,
  },
  inputField: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#333',
  },
  editButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#2e7d32',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  actionButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#2e7d32',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  // Estilos para mobile (mantidos exatamente iguais)
  '@media (max-width: 768px)': {
    headerContainer: {
      height: 200,
    },
    logoImage: {
      width: 60,
      height: 60,
    },
    logoText: {
      fontSize: 20,
    },
    menuText: {
      fontSize: 14,
    },
    profileContainer: {
      width: '100%',
      marginBottom: 15,
    },
    gridRow: {
      flexDirection: 'column',
    },
    gridTitle: {
      fontSize: 16,
    },
  },
});

export default HomeScreen;