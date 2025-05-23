import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Ícone de lupa (certifique-se que @expo/vector-icons está instalado)

const SpeciesSearchScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
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

      <ScrollView style={styles.scrollView}>
        <View style={styles.mainContent}>
          {/* Título */}
          <Text style={styles.pageTitle}>PESQUISA DE ESPÉCIE</Text>

          {/* Caixa de pesquisa com ícone de lupa */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Digite o nome da espécie..."
              placeholderTextColor="#999"
            />
            <Ionicons name="search" size={24} color="#2e7d32" />
          </View>

          {/* Resultado da pesquisa */}
          <Text style={styles.resultHeader}>Resultado da Pesquisa</Text>
          <View style={styles.resultContainer}>
            {/* Imagem */}
            <Image
              source={require('../assets/images/sem-imagem.webp')}
              style={styles.speciesImage}
              resizeMode="contain"
            />

            {/* Informações da espécie */}
            <View style={styles.infoContainer}>
              <View style={styles.resultSection}>
                <Text style={styles.resultLabel}>Nome Científico</Text>
                <Text style={styles.resultText}>Rosa damascena</Text>
              </View>
              <View style={styles.resultSection}>
                <Text style={styles.resultLabel}>Família</Text>
                <Text style={styles.resultText}>Rosaceae</Text>
              </View>
              <View style={styles.resultSection}>
                <Text style={styles.resultLabel}>Localização Geográfica</Text>
                <Text style={styles.resultText}>Europa, Ásia Ocidental</Text>
              </View>
              <View style={styles.resultSection}>
                <Text style={styles.resultLabel}>Características Principais</Text>
                <Text style={styles.resultText}>Arbusto perene com flores roxas altamente perfumadas</Text>
              </View>
              <View style={styles.resultSection}>
                <Text style={styles.resultLabel}>Nome Popular</Text>
                <Text style={styles.resultText}>Rosa-de-Damasco</Text>
              </View>
              <View style={styles.resultSection}>
                <Text style={styles.resultLabel}>Gênero</Text>
                <Text style={styles.resultText}>Rosa</Text>
              </View>
              <View style={styles.resultSection}>
                <Text style={styles.resultLabel}>Status de Conservação</Text>
                <Text style={styles.resultText}>Não ameaçada</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  // Header
  headerContainer: { height: 220, width: '100%', position: 'relative' },
  headerBackgroundImage: { width: '100%', height: '100%', position: 'absolute' },
  headerContent: { position: 'absolute', width: '100%', alignItems: 'center', paddingTop: 40 },
  logoImage: { width: 80, height: 80 },
  logoText: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 10 },
  menuTop: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 20 },
  menuItem: { paddingHorizontal: 10 },
  menuText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },

  scrollView: { flex: 1 },
  mainContent: { padding: 20 },

  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 20,
    textAlign: 'center',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 30,
    height: 45,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },

  resultHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 20,
  },

  resultContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
  },

  speciesImage: {
    width: 200,
    height: 200,
    backgroundColor: '#eee',
    borderRadius: 10,
  },

  infoContainer: {
    flex: 1,
    paddingLeft: 10,
  },

  resultSection: {
    marginBottom: 10,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 3,
  },
  resultText: {
    fontSize: 14,
    color: '#333',
  },
});

export default SpeciesSearchScreen;
