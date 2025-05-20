import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderInterno from '../components/HeaderInterno';

const HomeScreen = () => {
  const navigation = useNavigation();
  const windowWidth = Dimensions.get('window').width;
  const isMobile = windowWidth < 768; // Consideramos mobile abaixo de 768px

  return (
    <View style={styles.container}>
      <HeaderInterno />
      <ScrollView style={styles.content}>
        <View style={styles.mainContent}>
          <View style={[styles.gridContainer, isMobile && styles.gridContainerMobile]}>
            <View style={[styles.gridRow, isMobile && styles.gridRowMobile]}>
              <View style={[styles.profileContainer, isMobile && styles.profileContainerMobile]}>
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
              
              <View style={[styles.profileContainer, isMobile && styles.profileContainerMobile]}>
                <Text style={styles.gridTitle}>Espécies</Text>
                <Image source={require('../assets/images/3.webp')} style={styles.profileImage} />
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.buttonText}>Pesquisar espécie</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.buttonText}>Minhas coletas</Text>
                </TouchableOpacity>
              </View>
              
              <View style={[styles.profileContainer, isMobile && styles.profileContainerMobile]}>
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
          </View>
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
  content: {
    flex: 1,
  },
  mainContent: {
    padding: 15,
  },
  gridContainer: {
    width: '100%',
  },
  gridContainerMobile: {
    paddingHorizontal: 10,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  gridRowMobile: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  profileContainer: {
    width: '30%', // Ajustado para 3 cards lado a lado
    minWidth: 250, // Largura mínima para cada card
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    alignItems: 'center',
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileContainerMobile: {
    width: '100%',
    maxWidth: 350, // Largura máxima no mobile
    marginHorizontal: 0,
    marginBottom: 20,
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
});

export default HomeScreen;