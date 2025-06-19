import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const Notificacoes = () => {
  const [notificacoes, setNotificacoes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const conectarWebSocket = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const uuid = await AsyncStorage.getItem("user_id");

        if (!token || !uuid) {
          console.error("Token ou ID do usuário não encontrados");
          return;
        }

        // Criar cliente STOMP
        const client = new Client({
          webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
          connectHeaders: {
            Authorization: `Bearer ${token}`,
          },
          debug: function (str) {
            console.log(str);
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
          console.log("Conectado ao WebSocket");

          // Inscrever no tópico de notificações do usuário
          client.subscribe(`/user/${uuid}/topic/notificacoes`, (message) => {
            try {
              const notificacao = JSON.parse(message.body);
              console.log("Nova notificação recebida:", notificacao);

              // Mostrar alerta quando receber uma nova notificação
              Alert.alert("Nova Notificação", notificacao.mensagem, [
                { text: "OK" },
              ]);

              setNotificacoes((prev) => [notificacao, ...prev]);
            } catch (error) {
              console.error("Erro ao processar notificação:", error);
            }
          });
        };

        client.onStompError = (frame) => {
          console.error("Erro no STOMP:", frame);
        };

        client.activate();
        setStompClient(client);
        carregarNotificacoes(uuid);
      } catch (error) {
        console.error("Erro ao conectar WebSocket:", error);
      }
    };

    conectarWebSocket();

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, []);

  const carregarNotificacoes = async (uuid) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/notificacoes/usuario/${uuid}/nao-lidas`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao carregar notificações");
      }

      const data = await response.json();
      console.log("Notificações carregadas:", data);
      setNotificacoes(data);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    }
  };

  const marcarComoLida = async (notificacaoId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/notificacoes/${notificacaoId}/marcar-lida`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao marcar notificação como lida");
      }

      setNotificacoes((prev) => prev.filter((n) => n.id !== notificacaoId));
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
      Alert.alert("Erro", "Não foi possível marcar a notificação como lida");
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.iconButton}
      >
        <Text style={styles.icon}>🔔</Text>
        {notificacoes.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{notificacoes.length}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Notificações</Text>
            <ScrollView style={styles.notificacoesList}>
              {notificacoes.length === 0 ? (
                <Text style={styles.semNotificacoes}>Nenhuma notificação</Text>
              ) : (
                notificacoes.map((notificacao) => (
                  <TouchableOpacity
                    key={notificacao.id}
                    style={styles.notificacaoItem}
                    onPress={() => marcarComoLida(notificacao.id)}
                  >
                    <Text style={styles.notificacaoMensagem}>
                      {notificacao.mensagem}
                    </Text>
                    <Text style={styles.notificacaoData}>
                      {new Date(notificacao.dataCriacao).toLocaleString()}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.fecharButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.fecharButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    padding: 10,
    position: "relative",
  },
  icon: {
    fontSize: 24,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  notificacoesList: {
    maxHeight: "80%",
  },
  notificacaoItem: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  notificacaoMensagem: {
    fontSize: 16,
    marginBottom: 5,
  },
  notificacaoData: {
    fontSize: 12,
    color: "#666",
  },
  semNotificacoes: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
  fecharButton: {
    backgroundColor: "#2e7d32",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  fecharButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Notificacoes;
