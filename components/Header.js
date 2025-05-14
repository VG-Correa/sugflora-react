import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';

const Header = ({ navigation }) => {
  const { width: screenWidth } = useWindowDimensions();
  const isLargeScreen = screenWidth > 768;

  return (
    <View style={styles.header}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />

      <View
        style={[
          styles.nav,
          {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: isLargeScreen ? 12 : 8,
          },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={[styles.navItem, { fontSize: isLargeScreen ? 16 : 13 }]}>HOME</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={[styles.navItem, { fontSize: isLargeScreen ? 16 : 13 }]}>CADASTRE-SE</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.navItem, { fontSize: isLargeScreen ? 16 : 13 }]}>LOGIN</Text>
        </TouchableOpacity>
        <Text style={[styles.navItem, { fontSize: isLargeScreen ? 16 : 13 }]}>SOBRE</Text>
        <Text style={[styles.navItem, { fontSize: isLargeScreen ? 16 : 13 }]}>CONTATO</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  nav: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  navItem: {
    fontWeight: 'bold',
    marginHorizontal: 4,
    color: '#333',
  },
});

export default Header;