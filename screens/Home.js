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
        <Header navigation={navigation} /> {/* Já está configurado para navegar para Login */}

        <Image
          source={require('../assets/images/forest.jpg')}
          style={[styles.heroImage, { height: isLargeScreen ? 350 : 220 }]}
        />

        <View
          style={[
            styles.contentWrapper,
            { flexDirection: isLargeScreen ? 'row' : 'column' },
          ]}
        >
          {/* Texto e botão */}
          <View style={styles.left}>
            <Text style={styles.title}>Sistema Único de Gestão</Text>
            <Text style={styles.description}>
              O SUG-FLORA é um sistema de gestão para profissionais que lidam com plantas e flores,
              automatizando tarefas e integrando bancos de dados públicos. Além de facilitar o trabalho,
              oferece uma plataforma confiável para pesquisa, identificação de espécies e análise de dados.
            </Text>

            {/* Botão LOGIN verde - Já está configurado para navegar para Login */}
            <TouchableOpacity
              style={[styles.loginButton, { alignSelf: 'center' }]}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
          </View>

          {/* Imagens pequenas */}
          <View style={styles.right}>
            <Image
              source={require('../assets/images/forest1.jpg')}
              style={[styles.smallImage, {
                width: isLargeScreen ? 380 : 340,
                height: isLargeScreen ? 200 : 140,
              }]}
            />
            <Image
              source={require('../assets/images/forest2.jpg')}
              style={[styles.smallImage, {
                width: isLargeScreen ? 380 : 340,
                height: isLargeScreen ? 200 : 140,
              }]}
            />
            <Image
              source={require('../assets/images/forest3.jpg')}
              style={[styles.smallImage, {
                width: isLargeScreen ? 380 : 340,
                height: isLargeScreen ? 200 : 140,
              }]}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/* SEUS ESTILOS ORIGINAIS (totalmente inalterados) */
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
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
    gap: 20,
    flexWrap: 'wrap',
  },
  left: {
    flex: 1,
    paddingRight: 20,
    flexShrink: 0,
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
    marginBottom: 30,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  right: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  smallImage: {
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default Home;