import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Modal,
  Animated,
  Platform,
  Dimensions,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Notificacoes from "./Notificacoes";

const HeaderInterno = ({ onLogout }) => {
  const navigation = useNavigation();
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const [notificacaoAberta, setNotificacaoAberta] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const windowWidth = Dimensions.get("window").width;
  const isMobile = windowWidth < 768;

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const toggleSubmenu = (menuName) => {
    setActiveSubmenu(activeSubmenu === menuName ? null : menuName);
  };

  const toggleMenuMobile = () => {
    if (!menuAberto) {
      setMenuAberto(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setMenuAberto(false));
    }
  };

  const closeAllMenus = () => {
    setMenuAberto(false);
    setActiveSubmenu(null);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const nomeStored = await AsyncStorage.getItem("nome");
        const sobrenomeStored = await AsyncStorage.getItem("sobrenome");
        const emailStored = await AsyncStorage.getItem("email");
        const usernameStored = await AsyncStorage.getItem("username");

        if (!token) {
          console.log("Token não encontrado");
          return;
        }

        setNome(nomeStored || "");
        setSobrenome(sobrenomeStored || "");
        setEmail(emailStored || "");
        setUsername(usernameStored || "");
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "token",
        "nome",
        "sobrenome",
        "email",
        "username",
        "user_id",
      ]);

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });

      closeAllMenus();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      Alert.alert("Erro", "Não foi possível fazer logout. Tente novamente.");
    }
  };

  const renderMenuItems = (isMobileView) => (
    <>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          navigation.navigate("HomePage");
          closeAllMenus();
        }}
      >
        <Text style={styles.menuText}>PÁGINA INICIAL</Text>
      </TouchableOpacity>

      {/* PROJETOS */}
      <View style={styles.menuItem}>
        <TouchableOpacity onPress={() => toggleSubmenu("projetos")}>
          <Text style={styles.menuText}>PROJETOS</Text>
        </TouchableOpacity>
        {activeSubmenu === "projetos" && (
          <View style={isMobileView ? styles.submenuMobile : styles.submenu}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("MyProjects");
                closeAllMenus();
              }}
            >
              <Text
                style={[
                  styles.submenuText,
                  isMobileView && styles.submenuTextMobile,
                ]}
              >
                Meus Projetos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("NewProject");
                closeAllMenus();
              }}
            >
              <Text
                style={[
                  styles.submenuText,
                  isMobileView && styles.submenuTextMobile,
                ]}
              >
                Criar Projeto
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* COLETAS */}
      <View style={styles.menuItem}>
        <TouchableOpacity onPress={() => toggleSubmenu("coletas")}>
          <Text style={styles.menuText}>COLETAS</Text>
        </TouchableOpacity>
        {activeSubmenu === "coletas" && (
          <View style={isMobileView ? styles.submenuMobile : styles.submenu}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("MyCollection");
                closeAllMenus();
              }}
            >
              <Text
                style={[
                  styles.submenuText,
                  isMobileView && styles.submenuTextMobile,
                ]}
              >
                Minhas Coletas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SelectProjectAndField");
                closeAllMenus();
              }}
            >
              <Text
                style={[
                  styles.submenuText,
                  isMobileView && styles.submenuTextMobile,
                ]}
              >
                Nova Coleta
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ESPÉCIES */}
      <View style={styles.menuItem}>
        <TouchableOpacity onPress={() => toggleSubmenu("especies")}>
          <Text style={styles.menuText}>ESPÉCIES</Text>
        </TouchableOpacity>
        {activeSubmenu === "especies" && (
          <View style={isMobileView ? styles.submenuMobile : styles.submenu}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SearchSpecies");
                closeAllMenus();
              }}
            >
              <Text
                style={[
                  styles.submenuText,
                  isMobileView && styles.submenuTextMobile,
                ]}
              >
                Pesquisar Espécies
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SpeciesList");
                closeAllMenus();
              }}
            >
              <Text
                style={[
                  styles.submenuText,
                  isMobileView && styles.submenuTextMobile,
                ]}
              >
                Lista de Espécies
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* FLORA MATCH */}
      <View style={styles.menuItem}>
        <TouchableOpacity onPress={() => toggleSubmenu("floraMatch")}>
          <Text style={styles.menuText}>FLORA MATCH</Text>
        </TouchableOpacity>
        {activeSubmenu === "floraMatch" && (
          <View style={isMobileView ? styles.submenuMobile : styles.submenu}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("AjudemeAIdentificar");
                closeAllMenus();
              }}
            >
              <Text
                style={[
                  styles.submenuText,
                  isMobileView && styles.submenuTextMobile,
                ]}
              >
                Ajude-me a identificar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("EuConhecoEssa");
                closeAllMenus();
              }}
            >
              <Text
                style={[
                  styles.submenuText,
                  isMobileView && styles.submenuTextMobile,
                ]}
              >
                Eu conheço essa
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* RELATÓRIOS */}
      <View style={styles.menuItem}>
        <TouchableOpacity onPress={() => toggleSubmenu("relatorios")}>
          <Text style={styles.menuText}>RELATÓRIOS</Text>
        </TouchableOpacity>
        {activeSubmenu === "relatorios" && (
          <View style={isMobileView ? styles.submenuMobile : styles.submenu}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("MyReports");
                closeAllMenus();
              }}
            >
              <Text
                style={[
                  styles.submenuText,
                  isMobileView && styles.submenuTextMobile,
                ]}
              >
                Meus Relatórios
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("GenerateReport");
                closeAllMenus();
              }}
            >
              <Text
                style={[
                  styles.submenuText,
                  isMobileView && styles.submenuTextMobile,
                ]}
              >
                Gerar Relatório
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* NOTIFICAÇÕES */}
      <View style={styles.menuItem}>
        <Notificacoes />
      </View>

      {/* PERFIL */}
      <View style={styles.menuItem}>
        <TouchableOpacity
          onPress={async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              if (token) {
                navigation.navigate("Profile");
                closeAllMenus();
              } else {
                Alert.alert(
                  "Atenção",
                  "Você precisa estar logado para acessar seu perfil",
                  [
                    {
                      text: "OK",
                      onPress: () => navigation.navigate("Login"),
                    },
                  ]
                );
              }
            } catch (error) {
              console.error("Erro ao verificar autenticação:", error);
              Alert.alert("Erro", "Não foi possível acessar seu perfil");
            }
          }}
          style={styles.iconButton}
        >
          <Text style={styles.icon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* SAIR */}
      <View style={styles.menuItem}>
        <TouchableOpacity
          style={[styles.menuItem, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={[styles.menuText, styles.logoutText]}>SAIR</Text>
        </TouchableOpacity>
      </View>
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

        {isMobile ? (
          <>
            <TouchableOpacity
              onPress={toggleMenuMobile}
              style={styles.menuHamburguer}
            >
              <Text style={[styles.menuText, { fontSize: 20 }]}>
                {menuAberto ? "✕" : "☰"} MENU
              </Text>
            </TouchableOpacity>

            {menuAberto && (
              <>
                <TouchableOpacity
                  style={styles.menuBackdrop}
                  activeOpacity={1}
                  onPress={toggleMenuMobile}
                />
                <Animated.View
                  style={[styles.menuMobileContainer, { opacity: fadeAnim }]}
                >
                  {renderMenuItems(true)}
                </Animated.View>
              </>
            )}
          </>
        ) : (
          <View style={styles.menuTop}>{renderMenuItems(false)}</View>
        )}
      </View>

      <Modal
        transparent
        visible={notificacaoAberta}
        animationType="fade"
        onRequestClose={() => setNotificacaoAberta(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setNotificacaoAberta(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Notificações</Text>
            <Text>Nenhuma notificação no momento.</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    height: 170,
    position: "relative",
    zIndex: 1000,
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
    paddingTop: Platform.OS === "ios" ? 50 : 30,
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: 5,
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
    position: "relative",
    marginVertical: 5,
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
    position: "absolute",
    top: 30,
    left: 0,
    minWidth: 180,
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 10,
    borderRadius: 5,
    zIndex: 1001,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submenuMobile: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    zIndex: 1001,
  },
  submenuText: {
    color: "#2e7d32",
    fontWeight: "bold",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  submenuTextMobile: {
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  menuHamburguer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    right: 20,
    zIndex: 1001,
    backgroundColor: "rgba(46, 125, 50, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  menuBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 998,
  },
  menuMobileContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 90 : 70,
    right: 20,
    backgroundColor: "rgba(46, 125, 50, 0.95)",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxWidth: 300,
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconButton: {
    marginLeft: 10,
  },
  icon: {
    fontSize: 18,
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: "#ffebee",
    borderRadius: 5,
  },
  logoutText: {
    color: "#c62828",
  },
});

export default HeaderInterno;
