import AsyncStorage from "@react-native-async-storage/async-storage";

interface NotificacaoColeta {
  id: string;
  tipo: "coleta_ajuda" | "coleta_nova";
  mensagem: string;
  coletaId: number;
  nomeColeta: string;
  dataCriacao: string;
  lida: boolean;
}

class NotificationService {
  private static instance: NotificationService;
  private notificacoes: NotificacaoColeta[] = [];

  private constructor() {
    this.carregarNotificacoes();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async carregarNotificacoes() {
    try {
      const notificacoesSalvas = await AsyncStorage.getItem(
        "notificacoes_coletas"
      );
      if (notificacoesSalvas) {
        this.notificacoes = JSON.parse(notificacoesSalvas);
      }
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    }
  }

  private async salvarNotificacoes() {
    try {
      await AsyncStorage.setItem(
        "notificacoes_coletas",
        JSON.stringify(this.notificacoes)
      );
    } catch (error) {
      console.error("Erro ao salvar notificações:", error);
    }
  }

  public async adicionarNotificacaoColetaAjuda(coleta: any): Promise<void> {
    const notificacao: NotificacaoColeta = {
      id: Date.now().toString(),
      tipo: "coleta_ajuda",
      mensagem: `A coleta "${coleta.nome}" precisa de ajuda para identificação`,
      coletaId: coleta.id,
      nomeColeta: coleta.nome,
      dataCriacao: new Date().toISOString(),
      lida: false,
    };

    this.notificacoes.unshift(notificacao);
    await this.salvarNotificacoes();

    // Aqui você pode adicionar lógica para enviar notificação via WebSocket
    // ou para outros usuários do sistema
    console.log("Notificação de coleta com ajuda criada:", notificacao);
  }

  public async adicionarNotificacaoColetaNova(coleta: any): Promise<void> {
    const notificacao: NotificacaoColeta = {
      id: Date.now().toString(),
      tipo: "coleta_nova",
      mensagem: `Nova coleta "${coleta.nome}" foi cadastrada`,
      coletaId: coleta.id,
      nomeColeta: coleta.nome,
      dataCriacao: new Date().toISOString(),
      lida: false,
    };

    this.notificacoes.unshift(notificacao);
    await this.salvarNotificacoes();
  }

  public async getNotificacoesNaoLidas(): Promise<NotificacaoColeta[]> {
    await this.carregarNotificacoes();
    return this.notificacoes.filter((n) => !n.lida);
  }

  public async getTodasNotificacoes(): Promise<NotificacaoColeta[]> {
    await this.carregarNotificacoes();
    return this.notificacoes;
  }

  public async marcarComoLida(notificacaoId: string): Promise<void> {
    const notificacao = this.notificacoes.find((n) => n.id === notificacaoId);
    if (notificacao) {
      notificacao.lida = true;
      await this.salvarNotificacoes();
    }
  }

  public async marcarTodasComoLidas(): Promise<void> {
    this.notificacoes.forEach((n) => (n.lida = true));
    await this.salvarNotificacoes();
  }

  public async limparNotificacoes(): Promise<void> {
    this.notificacoes = [];
    await this.salvarNotificacoes();
  }

  public getQuantidadeNaoLidas(): number {
    return this.notificacoes.filter((n) => !n.lida).length;
  }

  // Método para enviar notificação via WebSocket (se disponível)
  public async enviarNotificacaoWebSocket(
    notificacao: NotificacaoColeta
  ): Promise<void> {
    try {
      // Aqui você implementaria a lógica para enviar via WebSocket
      // Por exemplo, usando o STOMP client
      console.log("Enviando notificação via WebSocket:", notificacao);
    } catch (error) {
      console.error("Erro ao enviar notificação via WebSocket:", error);
    }
  }
}

export default NotificationService;
