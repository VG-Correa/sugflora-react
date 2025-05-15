import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Modal } from 'react-native';

const Header = ({ navigation }) => {
  const { width: screenWidth } = useWindowDimensions();
  const isLargeScreen = screenWidth > 611;

  const [menuVisible, setMenuVisible] = useState(false);

  const renderNavItems = (isVertical = false) => (
    <>
      <TouchableOpacity onPress={() => { navigation.navigate('Home'); setMenuVisible(false); }}>
        <Text style={[styles.navItem, isVertical && styles.verticalItem]}>HOME</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { navigation.navigate('Register'); setMenuVisible(false); }}>
        <Text style={[styles.navItem, isVertical && styles.verticalItem]}>CADASTRE-SE</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { navigation.navigate('Login'); setMenuVisible(false); }}>
        <Text style={[styles.navItem, isVertical && styles.verticalItem]}>LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { navigation.navigate('About'); setMenuVisible(false); }}>
        <Text style={[styles.navItem, isVertical && styles.verticalItem]}>SOBRE</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { navigation.navigate('Contact'); setMenuVisible(false); }}>
        <Text style={[styles.navItem, isVertical && styles.verticalItem]}>CONTATO</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.header}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} />

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
    backgroundColor: '#fff',
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
    padding: 8,
  },
  menuText: {
    fontSize: 28,
    color: '#333',
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
