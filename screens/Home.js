import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import Header from '../components/Header';

const Home = ({ navigation }) => {
  const { width: screenWidth } = useWindowDimensions();
  const isLargeScreen = screenWidth > 768;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header fixo no topo com logo e navegação */}
        <Header navigation={navigation} /> 

        <Image
          source={require('../assets/images/forest.webp')}
          style={[styles.heroImage, { height: isLargeScreen ? 350 : 220 }]}
        />

<View style={[styles.contentWrapper, { flexDirection: isLargeScreen ? 'row' : 'column' }]}>
  {/* Seção Esquerda (Texto + Botão) */}
  <View style={[styles.left, { flex: 1 }]}> 
    <Text style={styles.title}>Sistema Único de Gestão</Text>
    <Text style={styles.description}>
      O SUG-FLORA é um sistema de gestão para profissionais que lidam com plantas e flores,
      automatizando tarefas e integrando bancos de dados públicos. Além de facilitar o trabalho,
      oferece uma plataforma confiável para pesquisa, identificação de espécies e análise de dados.
    </Text>

    {/* Botão fixo na base */}
    <TouchableOpacity
      style={styles.loginButton}
      onPress={() => navigation.navigate('Login')}
    >
      <Text style={styles.loginText}>LOGIN</Text>
    </TouchableOpacity>
  </View>

  {/* Seção Direita (Imagens) */}
  <View style={[styles.right, { flex: isLargeScreen ? 1 : undefined }]}>
    <Image
      source={require('../assets/images/forest1.webp')}
      style={styles.smallImage}
    />
    <Image
      source={require('../assets/images/forest2.webp')}
      style={styles.smallImage}
    />
    <Image
      source={require('../assets/images/forest2.webp')}
      style={styles.smallImage}
    />
  </View>
</View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingBottom: 30,
  },
  heroImage: {
    width: '100%',
    resizeMode: 'cover',
  },
  contentWrapper: {
    flex: 1, 
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
    gap: 20,
  },
  left: {
    flex: 1,
    justifyContent: 'space-between', 
    paddingRight: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'left',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'justify',
  },
  loginButton: {
    backgroundColor: '#648C47',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 'auto', 
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
  },
    right: {
    flex: 1,
    justifyContent: 'center', 
    gap: 10,
  },
   
  smallImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
    borderRadius: 10,
  },
});

export default Home;