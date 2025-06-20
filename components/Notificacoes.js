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
import { useColetaNotifications } from "../data/hooks/useColetaNotifications";

const Notificacoes = () => {
  return ;
  const [modalVisible, setModalVisible] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const {
    notificacoes,
    quantidadeNaoLidas,
    loading,
    carregarNotificacoes,
    marcarComoLida,
    marcarTodasComoLidas,
  } = useColetaNotifications();

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

              // Recarregar notificações locais
              carregarNotificacoes();
            } catch (error) {
              console.error("Erro ao processar notificação:", error);
            }
          });

          // Inscrever no tópico de coletas com solicitação de ajuda
          client.subscribe(`/topic/coletas-ajuda-identificacao`, (message) => {
            try {
              const notificacao = JSON.parse(message.body);
              console.log("Nova coleta com solicitação de ajuda:", notificacao);

              // Mostrar alerta específico para coletas com solicitação de ajuda
              Alert.alert(
                "Nova Coleta Precisa de Ajuda! 🔍",
                `A coleta "${notificacao.nomeColeta}" precisa de ajuda para identificação. Clique em "Ver Detalhes" para ajudar!`,
                [
                  { text: "OK" },
                  {
                    text: "Ver Detalhes",
                    onPress: () => {
                      // Aqui você pode navegar para a tela da coleta
                      console.log("Navegar para coleta:", notificacao.coletaId);
                    },
                  },
                ]
              );

              // Recarregar notificações locais
              carregarNotificacoes();
            } catch (error) {
              console.error("Erro ao processar notificação de coleta:", error);
            }
          });
        };

        client.onStompError = (frame) => {
          console.error("Erro no STOMP:", frame);
        };

        client.activate();
        setStompClient(client);
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
  }, [carregarNotificacoes]);

  const handleMarcarComoLida = async (notificacaoId) => {
    try {
      await marcarComoLida(notificacaoId);
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
      Alert.alert("Erro", "Não foi possível marcar a notificação como lida");
    }
  };

  const handleMarcarTodasComoLidas = async () => {
    try {
      await marcarTodasComoLidas();
      Alert.alert("Sucesso", "Todas as notificações foram marcadas como lidas");
    } catch (error) {
      console.error("Erro ao marcar todas as notificações como lidas:", error);
      Alert.alert(
        "Erro",
        "Não foi possível marcar todas as notificações como lidas"
      );
    }
  };

  const getNotificacaoIcon = (tipo) => {
    switch (tipo) {
      case "coleta_ajuda":
        return "🔍";
      case "coleta_nova":
        return "🌿";
      default:
        return "🔔";
    }
  };

  const getNotificacaoStyle = (tipo) => {
    switch (tipo) {
      case "coleta_ajuda":
        return styles.notificacaoAjuda;
      case "coleta_nova":
        return styles.notificacaoNova;
      default:
        return styles.notificacaoItem;
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.iconButton}
      >
        <Text style={styles.icon}>🔔</Text>
        {quantidadeNaoLidas > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{quantidadeNaoLidas}</Text>
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
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notificações</Text>
              {notificacoes.length > 0 && (
                <TouchableOpacity
                  style={styles.marcarTodasButton}
                  onPress={handleMarcarTodasComoLidas}
                >
                  <Text style={styles.marcarTodasText}>
                    Marcar todas como lidas
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView style={styles.notificacoesList}>
              {loading ? (
                <Text style={styles.semNotificacoes}>
                  Carregando notificações...
                </Text>
              ) : notificacoes.length === 0 ? (
                <Text style={styles.semNotificacoes}>Nenhuma notificação</Text>
              ) : (
                notificacoes.map((notificacao) => (
                  <TouchableOpacity
                    key={notificacao.id}
                    style={[
                      getNotificacaoStyle(notificacao.tipo),
                      !notificacao.lida && styles.notificacaoNaoLida,
                    ]}
                    onPress={() => handleMarcarComoLida(notificacao.id)}
                  >
                    <View style={styles.notificacaoHeader}>
                      <Text style={styles.notificacaoIcon}>
                        {getNotificacaoIcon(notificacao.tipo)}
                      </Text>
                      <Text style={styles.notificacaoMensagem}>
                        {notificacao.mensagem}
                      </Text>
                    </View>
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
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  marcarTodasButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  marcarTodasText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
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
  notificacaoNaoLida: {
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
    backgroundColor: "#e3f2fd",
  },
  notificacaoAjuda: {
    backgroundColor: "#fff3e0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#ff9800",
  },
  notificacaoNova: {
    backgroundColor: "#e8f5e9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#4caf50",
  },
  notificacaoHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  notificacaoIcon: {
    fontSize: 18,
    marginRight: 10,
    marginTop: 2,
  },
  notificacaoMensagem: {
    fontSize: 16,
    flex: 1,
  },
  notificacaoData: {
    fontSize: 12,
    color: "#666",
    marginLeft: 28,
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
