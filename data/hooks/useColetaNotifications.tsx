import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotificationService from "../services/NotificationService";
import { useNotification } from "../../contexts/NotificationContext";

interface NotificacaoColeta {
  id: string;
  tipo: "coleta_ajuda" | "coleta_nova";
  mensagem: string;
  coletaId: number;
  nomeColeta: string;
  dataCriacao: string;
  lida: boolean;
}

export const useColetaNotifications = () => {
  const [notificacoes, setNotificacoes] = useState<NotificacaoColeta[]>([]);
  const [quantidadeNaoLidas, setQuantidadeNaoLidas] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const { showNotification } = useNotification();
  const [notificationService] = useState(NotificationService.getInstance());

  // Verificar se o usuário está logado
  const checkUserLogin = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("user_id");
      const isLoggedIn = !!(token && userId);
      setIsUserLoggedIn(isLoggedIn);
      return isLoggedIn;
    } catch (error) {
      console.error("Erro ao verificar login do usuário:", error);
      setIsUserLoggedIn(false);
      return false;
    }
  }, []);

  const carregarNotificacoes = useCallback(async () => {
    try {
      // Verificar se o usuário está logado antes de carregar notificações
      const loggedIn = await checkUserLogin();
      if (!loggedIn) {
        setNotificacoes([]);
        setQuantidadeNaoLidas(0);
        return;
      }

      setLoading(true);
      const todasNotificacoes =
        await notificationService.getTodasNotificacoes();
      const naoLidas = await notificationService.getNotificacoesNaoLidas();

      setNotificacoes(todasNotificacoes);
      setQuantidadeNaoLidas(naoLidas.length);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      setLoading(false);
    }
  }, [notificationService, checkUserLogin]);

  const marcarComoLida = useCallback(
    async (notificacaoId: string) => {
      try {
        // Verificar se o usuário está logado
        const loggedIn = await checkUserLogin();
        if (!loggedIn) {
          console.log(
            "Usuário não está logado, não é possível marcar notificação como lida"
          );
          return;
        }

        await notificationService.marcarComoLida(notificacaoId);
        setNotificacoes((prev) => prev.filter((n) => n.id !== notificacaoId));
        setQuantidadeNaoLidas((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Erro ao marcar notificação como lida:", error);
      }
    },
    [notificationService, checkUserLogin]
  );

  const marcarTodasComoLidas = useCallback(async () => {
    try {
      // Verificar se o usuário está logado
      const loggedIn = await checkUserLogin();
      if (!loggedIn) {
        console.log(
          "Usuário não está logado, não é possível marcar notificações como lidas"
        );
        return;
      }

      await notificationService.marcarTodasComoLidas();
      setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));
      setQuantidadeNaoLidas(0);
    } catch (error) {
      console.error("Erro ao marcar todas as notificações como lidas:", error);
    }
  }, [notificationService, checkUserLogin]);

  const limparNotificacoes = useCallback(async () => {
    try {
      // Verificar se o usuário está logado
      const loggedIn = await checkUserLogin();
      if (!loggedIn) {
        console.log(
          "Usuário não está logado, não é possível limpar notificações"
        );
        return;
      }

      await notificationService.limparNotificacoes();
      setNotificacoes([]);
      setQuantidadeNaoLidas(0);
    } catch (error) {
      console.error("Erro ao limpar notificações:", error);
    }
  }, [notificationService, checkUserLogin]);

  const adicionarNotificacaoColetaAjuda = useCallback(
    async (coleta: any) => {
      try {
        // Verificar se o usuário está logado
        const loggedIn = await checkUserLogin();
        if (!loggedIn) {
          console.log(
            "Usuário não está logado, não é possível adicionar notificação"
          );
          return;
        }

        await notificationService.adicionarNotificacaoColetaAjuda(coleta);

        // Mostrar notificação local
        showNotification(
          `Nova coleta "${coleta.nome}" precisa de ajuda para identificação! 🔍`,
          8000
        );

        // Recarregar notificações
        await carregarNotificacoes();
      } catch (error) {
        console.error("Erro ao adicionar notificação de ajuda:", error);
      }
    },
    [
      notificationService,
      showNotification,
      carregarNotificacoes,
      checkUserLogin,
    ]
  );

  const adicionarNotificacaoColetaNova = useCallback(
    async (coleta: any) => {
      try {
        // Verificar se o usuário está logado
        const loggedIn = await checkUserLogin();
        if (!loggedIn) {
          console.log(
            "Usuário não está logado, não é possível adicionar notificação"
          );
          return;
        }

        await notificationService.adicionarNotificacaoColetaNova(coleta);

        // Mostrar notificação local
        showNotification(
          `Nova coleta "${coleta.nome}" foi cadastrada! 🌿`,
          5000
        );

        // Recarregar notificações
        await carregarNotificacoes();
      } catch (error) {
        console.error("Erro ao adicionar notificação de nova coleta:", error);
      }
    },
    [
      notificationService,
      showNotification,
      carregarNotificacoes,
      checkUserLogin,
    ]
  );

  // Carregar notificações quando o hook for inicializado
  useEffect(() => {
    carregarNotificacoes();
  }, [carregarNotificacoes]);

  // Verificar login do usuário periodicamente
  useEffect(() => {
    const checkLoginInterval = setInterval(() => {
      checkUserLogin();
    }, 30000); // Verificar a cada 30 segundos

    return () => clearInterval(checkLoginInterval);
  }, [checkUserLogin]);

  return {
    notificacoes,
    quantidadeNaoLidas,
    loading,
    isUserLoggedIn,
    carregarNotificacoes,
    marcarComoLida,
    marcarTodasComoLidas,
    limparNotificacoes,
    adicionarNotificacaoColetaAjuda,
    adicionarNotificacaoColetaNova,
  };
};
