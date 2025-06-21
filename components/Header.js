import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Modal } from 'react-native';
import {useRoute} from '@react-navigation/native'

const Header = ({ navigation }) => {
  const { width: screenWidth } = useWindowDimensions();
  const isLargeScreen = screenWidth > 611;
  
  const route = useRoute()
  const screenName = route.name
  const isLoginScreen = screenName === 'Login';

  const [menuVisible, setMenuVisible] = useState(false);

  const renderNavItems = (isVertical = false) => (
    <>
      <TouchableOpacity onPress={() => { navigation.navigate('Home'); setMenuVisible(false); }}>
        <Text style={[styles.navItem, isVertical && styles.verticalItem, isLoginScreen && isLargeScreen && {color: 'white'}]}>HOME</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { navigation.navigate('Register'); setMenuVisible(false); }}>
        <Text style={[styles.navItem, isVertical && styles.verticalItem, isLoginScreen && isLargeScreen && {color: 'white'}]}>CADASTRE-SE</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { navigation.navigate('Login'); setMenuVisible(false); }}>
        <Text style={[styles.navItem, isVertical && styles.verticalItem, isLoginScreen &&  isLargeScreen && {color: 'white'}]}>LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { navigation.navigate('About'); setMenuVisible(false); }}>
        <Text style={[styles.navItem, isVertical && styles.verticalItem, isLoginScreen &&  isLargeScreen && {color: 'white'}]}>SOBRE</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { navigation.navigate('Contact'); setMenuVisible(false); }}>
        <Text style={[styles.navItem, isVertical && styles.verticalItem, isLoginScreen &&  isLargeScreen && {color: 'white'}]}>CONTATO</Text>
      </TouchableOpacity>
    </>
  );
  


  return (

    <View
      style={[
        styles.header,
        { 
          backgroundColor: isLoginScreen ? '#00000000' : 'white',
        },
      ]}
    >
      <Image source={require('../assets/images/logo.webp')} style={styles.logo} />

      {isLargeScreen ? (
        <View style={styles.nav}>
          {renderNavItems()}
        </View>
      ) : (
        <>
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
            <Text style={styles.menuText}>☰</Text>
          </TouchableOpacity>

          <Modal visible={menuVisible} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalMenu}>
                <TouchableOpacity onPress={() => setMenuVisible(false)}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
                {renderNavItems(true)}
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  nav: {
    flexDirection: 'row',
    gap: 12,
  },
  navItem: {
    fontWeight: 'bold',
    marginHorizontal: 8,
    color: '#333',
    fontSize: 16,
  },
  menuButton: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  menuText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'flex-end',
  },
  modalMenu: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  closeText: {
    fontSize: 24,
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  verticalItem: {
    fontSize: 18,
    marginVertical: 8,
  },
});

export default Header;
