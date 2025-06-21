import Notificacao from "./Notificacao";

class NotificacaoData {
  private baseURL: string = "http://localhost:8080/api";

  async getAllNotificacoes(): Promise<{
    status: number;
    data?: any;
    message?: string;
  }> {
    try {
      const response = await fetch(`${this.baseURL}/notificacoes`);
      const data = await response.json();

      if (response.ok) {
        return {
          status: 200,
          data: data.map(
            (item: any) =>
              new Notificacao(
                item.id,
                item.titulo,
                item.mensagem,
                item.tipo,
                item.usuario_id,
                item.lida,
                item.created_at,
                item.updated_at,
                item.deleted
              )
          ),
        };
      } else {
        return {
          status: response.status,
          message: data.message || "Erro ao buscar notificações",
        };
      }
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      return {
        status: 500,
        message: "Erro interno do servidor",
      };
    }
  }

  async getNotificacaoById(
    id: number
  ): Promise<{ status: number; data?: any; message?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/notificacoes/${id}`);
      const data = await response.json();

      if (response.ok) {
        return {
          status: 200,
          data: new Notificacao(
            data.id,
            data.titulo,
            data.mensagem,
            data.tipo,
            data.usuario_id,
            data.lida,
            data.created_at,
            data.updated_at,
            data.deleted
          ),
        };
      } else {
        return {
          status: response.status,
          message: data.message || "Erro ao buscar notificação",
        };
      }
    } catch (error) {
      console.error("Erro ao buscar notificação:", error);
      return {
        status: 500,
        message: "Erro interno do servidor",
      };
    }
  }

  async getNotificacoesByUsuario(
    usuarioId: number
  ): Promise<{ status: number; data?: any; message?: string }> {
    try {
      const response = await fetch(
        `${this.baseURL}/notificacoes/usuario/${usuarioId}`
      );
      const data = await response.json();

      if (response.ok) {
        return {
          status: 200,
          data: data.map(
            (item: any) =>
              new Notificacao(
                item.id,
                item.titulo,
                item.mensagem,
                item.tipo,
                item.usuario_id,
                item.lida,
                item.created_at,
                item.updated_at,
                item.deleted
              )
          ),
        };
      } else {
        return {
          status: response.status,
          message: data.message || "Erro ao buscar notificações do usuário",
        };
      }
    } catch (error) {
      console.error("Erro ao buscar notificações do usuário:", error);
      return {
        status: 500,
        message: "Erro interno do servidor",
      };
    }
  }

  async createNotificacao(
    notificacao: Notificacao
  ): Promise<{ status: number; data?: any; message?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/notificacoes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notificacao),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          status: 200,
          data: new Notificacao(
            data.id,
            data.titulo,
            data.mensagem,
            data.tipo,
            data.usuario_id,
            data.lida,
            data.created_at,
            data.updated_at,
            data.deleted
          ),
        };
      } else {
        return {
          status: response.status,
          message: data.message || "Erro ao criar notificação",
        };
      }
    } catch (error) {
      console.error("Erro ao criar notificação:", error);
      return {
        status: 500,
        message: "Erro interno do servidor",
      };
    }
  }

  async updateNotificacao(
    notificacao: Notificacao
  ): Promise<{ status: number; data?: any; message?: string }> {
    try {
      const response = await fetch(
        `${this.baseURL}/notificacoes/${notificacao.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notificacao),
        }
      );

      const data = await response.json();

      if (response.ok) {
        return {
          status: 200,
          data: new Notificacao(
            data.id,
            data.titulo,
            data.mensagem,
            data.tipo,
            data.usuario_id,
            data.lida,
            data.created_at,
            data.updated_at,
            data.deleted
          ),
        };
      } else {
        return {
          status: response.status,
          message: data.message || "Erro ao atualizar notificação",
        };
      }
    } catch (error) {
      console.error("Erro ao atualizar notificação:", error);
      return {
        status: 500,
        message: "Erro interno do servidor",
      };
    }
  }

  async deleteNotificacao(
    id: number
  ): Promise<{ status: number; data?: any; message?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/notificacoes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        return {
          status: 200,
          message: "Notificação excluída com sucesso",
        };
      } else {
        const data = await response.json();
        return {
          status: response.status,
          message: data.message || "Erro ao excluir notificação",
        };
      }
    } catch (error) {
      console.error("Erro ao excluir notificação:", error);
      return {
        status: 500,
        message: "Erro interno do servidor",
      };
    }
  }

  async marcarComoLida(
    id: number
  ): Promise<{ status: number; data?: any; message?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/notificacoes/${id}/lida`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lida: true }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          status: 200,
          data: new Notificacao(
            data.id,
            data.titulo,
            data.mensagem,
            data.tipo,
            data.usuario_id,
            data.lida,
            data.created_at,
            data.updated_at,
            data.deleted
          ),
        };
      } else {
        return {
          status: response.status,
          message: data.message || "Erro ao marcar notificação como lida",
        };
      }
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
      return {
        status: 500,
        message: "Erro interno do servidor",
      };
    }
  }
}

export default NotificacaoData;
