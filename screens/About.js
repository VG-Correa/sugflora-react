import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import Header from '../components/Header';

const AboutScreen = ({ navigation }) => {
  const { width: screenWidth } = useWindowDimensions();
  const isLargeScreen = screenWidth > 768;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Header navigation={navigation} />
        
        <Image
          source={require('../assets/images/forest.webp')}
          style={[styles.heroImage, { height: isLargeScreen ? 350 : 220 }]}
        />

        <View style={[
          styles.contentWrapper,
          { paddingHorizontal: isLargeScreen ? 40 : 20 }
        ]}>
          <Text style={[
            styles.title,
            { fontSize: isLargeScreen ? 32 : 28 }
          ]}>
            SUG - FLORA
          </Text>

          <View style={styles.textContent}>
            <Text style={styles.paragraph}>
              O SIG-FLORA é uma síntese única de gestão de flora para facilitar o trabalho e a família. 
              Além das águias com uma grande diferência de pessoas, a folga, instalações que foram 
              observadas à alimentação acerca dos seus usuários, afasta-se a imagens.
            </Text>

            <Text style={styles.paragraph}>
              Com um banco de dados próprio e sincronizado com trevas políticas, o SIG-FLORA perturbe 
              inserções, remotos e consulta de dados de forma digital, além de gerar relatórios e 
              gratificas classificadas identificados. Além de definir-se o trabalho diário, o sistema 
              se lembra com ferramentas nacional controlais para o comunhão social, científica, 
              qualitativo na identificação de espetáculos, cedera de dados e pesquisas.
            </Text>

            <Text style={[styles.paragraph, styles.highlight]}>
              Nosso objetivo é simplizar oferecer mais eficiência com nossos estágios.
            </Text>
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
    paddingBottom: 40,
  },
  heroImage: {
    width: '100%',
    resizeMode: 'cover',
    marginBottom: 20,
  },
  contentWrapper: {
    flex: 1,
    paddingTop: 10,
  },
  title: {
    fontWeight: '600',
    color: '#2d5a27',
    textAlign: 'center',
    marginBottom: 25,
    textTransform: 'uppercase',
  },
  textContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 8,
    padding: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 22,
    color: '#444',
    marginBottom: 20,
    textAlign: 'left',
  },
  highlight: {
    color: '#4267B2',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 18,
    fontStyle: 'italic',
  },
});

export default AboutScreen;