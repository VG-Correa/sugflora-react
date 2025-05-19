import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const HeaderInterno = () => {
  const navigation = useNavigation();
  const [showFloraMatchSubmenu, setShowFloraMatchSubmenu] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  const renderMenuItems = () => (
    <>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.menuText}>PÁGINA INICIAL</Text>
      </TouchableOpacity>

      {/* PROJETOS */}
      <View style={styles.menuItem}>
        <TouchableOpacity
          onPress={() => setShowFloraMatchSubmenu(!showFloraMatchSubmenu)}
        >
          <Text style={styles.menuText}>PROJETOS</Text>
        </TouchableOpacity>
        {showFloraMatchSubmenu && (
          <View style={styles.submenu}>
            <TouchableOpacity onPress={() => navigation.navigate("Identificar")}>
              <Text style={styles.submenuText}>Meus Projetos</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("ConhecoEssa")}>
              <Text style={styles.submenuText}>Criar Projetos</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ESPÉCIES */}
      <View style={styles.menuItem}>
        <TouchableOpacity
          onPress={() => setShowFloraMatchSubmenu(!showFloraMatchSubmenu)}
        >
          <Text style={styles.menuText}>ESPÉCIES</Text>
        </TouchableOpacity>
        {showFloraMatchSubmenu && (
          <View style={styles.submenu}>
            <TouchableOpacity onPress={() => navigation.navigate("Identificar")}>
              <Text style={styles.submenuText}>Pesquisar Espécies</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("ConhecoEssa")}>
              <Text style={styles.submenuText}>Minhas Coletas</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* FLORA MATCH */}
      <View style={styles.menuItem}>
        <TouchableOpacity
          onPress={() => setShowFloraMatchSubmenu(!showFloraMatchSubmenu)}
        >
          <Text style={styles.menuText}>FLORA MATCH</Text>
        </TouchableOpacity>
        {showFloraMatchSubmenu && (
          <View style={styles.submenu}>
            <TouchableOpacity onPress={() => navigation.navigate("Identificar")}>
              <Text style={styles.submenuText}>Ajude-me a identificar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("ConhecoEssa")}>
              <Text style={styles.submenuText}>Eu conheço essa</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* RELATÓRIO */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("Relatorios")}
      >
        <Text style={styles.menuText}>RELATÓRIO</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.headerContainer}>
      <Image
        source={require("../assets/images/cabecalho.webp")}
        style={styles.headerBackgroundImage}
        resizeMode="cover"
      />
      <View style={styles.headerContent}>
        <Image
          source={require("../assets/images/logo.webp")}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.logoText}>SUG - FLORA</Text>

        {isMobile ? (
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity onPress={() => setMenuAberto(!menuAberto)}>
              <Text style={[styles.menuText, { fontSize: 20 }]}>☰ MENU</Text>
            </TouchableOpacity>
            {menuAberto && <View style={styles.menuMobile}>{renderMenuItems()}</View>}
          </View>
        ) : (
          <View style={styles.menuTop}>{renderMenuItems()}</View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    height: 220,
    position: "relative",
  },
  headerBackgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  headerContent: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
    paddingTop: 20,
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: 5,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    marginBottom: 15,
  },
  menuTop: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingVertical: 10,
  },
  menuItem: {
    marginHorizontal: 10,
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  submenu: {
    marginTop: 5,
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 5,
    borderRadius: 5,
  },
  submenuText: {
    color: "#2e7d32",
    fontWeight: "bold",
    paddingVertical: 3,
  },
  menuMobile: {
    marginTop: 10,
    alignItems: "center",
    gap: 10,
  },
});

export default HeaderInterno;
