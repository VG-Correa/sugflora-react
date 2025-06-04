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
import { Ionicons } from '@expo/vector-icons';

const SpeciesSearchScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.headerContainer}>
        <Image
          source={require('../assets/images/cabecalho.webp')}  // Alterei para webp
          style={styles.headerBackgroundImage}
          resizeMode="cover"
        />
        <View style={styles.headerContent}>
          <Image
            source={require('../assets/images/logo.png')}  // Alterei para webp
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
          {/* ... resto do código permanece igual ... */}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  headerContainer: { 
    height: 220, 
    width: '100%', 
    position: 'relative', 
    backgroundColor: '#2e7d32' 
  },
  headerBackgroundImage: { 
    width: '100%', 
    height: '100%', 
    position: 'absolute' 
  },
  headerContent: { 
    position: 'absolute', 
    width: '100%', 
    alignItems: 'center', 
    paddingTop: 40 
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
    width: '90%', 
  },
  menuItem: { 
    paddingHorizontal: 10,
  },
  menuText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 14,
  },

  scrollView: { flex: 1 },
  mainContent: { padding: 20 },

  // ... o restante do styles permanece igual ...
});

export default SpeciesSearchScreen;
