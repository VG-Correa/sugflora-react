import Relatorio from "./Relatorio";

class RelatorioData {
  private baseURL: string = "http://localhost:8080/api";

  async getAllRelatorios(): Promise<{
    status: number;
    data?: any;
    message?: string;
  }> {
    try {
      const response = await fetch(`${this.baseURL}/relatorios`);
      const data = await response.json();

      if (response.ok) {
        return {
          status: 200,
          data: data.map(
            (item: any) =>
              new Relatorio(
                item.id,
                item.titulo,
                item.descricao,
                item.tipo,
                item.projeto_id,
                item.usuario_id,
                item.data_inicio,
                item.data_fim,
                item.status,
                item.arquivo_url,
                item.created_at,
                item.updated_at,
                item.deleted
              )
          ),
        };
      } else {
        return {
          status: response.status,
          message: data.message || "Erro ao buscar relatórios",
        };
      }
    } catch (error) {
      console.error("Erro ao buscar relatórios:", error);
      return {
        status: 500,
        message: "Erro interno do servidor",
      };
    }
  }

  async getRelatorioById(
    id: number
  ): Promise<{ status: number; data?: any; message?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/relatorios/${id}`);
      const data = await response.json();

      if (response.ok) {
        return {
          status: 200,
          data: new Relatorio(
            data.id,
            data.titulo,
            data.descricao,
            data.tipo,
            data.projeto_id,
            data.usuario_id,
            data.data_inicio,
            data.data_fim,
            data.status,
            data.arquivo_url,
            data.created_at,
            data.updated_at,
            data.deleted
          ),
        };
      } else {
        return {
          status: response.status,
          message: data.message || "Erro ao buscar relatório",
        };
      }
    } catch (error) {
      console.error("Erro ao buscar relatório:", error);
      return {
        status: 500,
        message: "Erro interno do servidor",
      };
    }
  }

  async getRelatoriosByProjeto(
    projetoId: number
  ): Promise<{ status: number; data?: any; message?: string }> {
    try {
      const response = await fetch(
        `${this.baseURL}/relatorios/projeto/${projetoId}`
      );
      const data = await response.json();

      if (response.ok) {
        return {
          status: 200,
          data: data.map(
            (item: any) =>
              new Relatorio(
                item.id,
                item.titulo,
                item.descricao,
                item.tipo,
                item.projeto_id,
                item.usuario_id,
                item.data_inicio,
                item.data_fim,
                item.status,
                item.arquivo_url,
                item.created_at,
                item.updated_at,
                item.deleted
              )
          ),
        };
      } else {
        return {
          status: response.status,
          message: data.message || "Erro ao buscar relatórios do projeto",
        };
      }
    } catch (error) {
      console.error("Erro ao buscar relatórios do projeto:", error);
      return {
        status: 500,
        message: "Erro interno do servidor",
      };
    }
  }

  async getRelatoriosByUsuario(
    usuarioId: number
  ): Promise<{ status: number; data?: any; message?: string }> {
    try {
      const response = await fetch(
        `${this.baseURL}/relatorios/usuario/${usuarioId}`
      );
      const data = await response.json();

      if (response.ok) {
        return {
          status: 200,
          data: data.map(
            (item: any) =>
              new Relatorio(
                item.id,
                item.titulo,
                item.descricao,
                item.tipo,
                item.projeto_id,
                item.usuario_id,
                item.data_inicio,
                item.data_fim,
                item.status,
                item.arquivo_url,
                item.created_at,
                item.updated_at,
                item.deleted
              )
          ),
        };
      } else {
        return {
          status: response.status,
          message: data.message || "Erro ao buscar relatórios do usuário",
        };
      }
    } catch (error) {
      console.error("Erro ao buscar relatórios do usuário:", error);
      return {
        status: 500,
        message: "Erro interno do servidor",
      };
    }
  }

  async createRelatorio(
    relatorio: Relatorio
  ): Promise<{ status: number; data?: any; message?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/relatorios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(relatorio),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          status: 200,
          data: new Relatorio(
            data.id,
            data.titulo,
            data.descricao,
            data.tipo,
            data.projeto_id,
            data.usuario_id,
            data.data_inicio,
            data.data_fim,
            data.status,
            data.arquivo_url,
            data.created_at,
            data.updated_at,
            data.deleted
          ),
        };
      } else {
        return {
          status: response.status,
          message: data.message || "Erro ao criar relatório",
        };
      }
    } catch (error) {
      console.error("Erro ao criar relatório:", error);
      return {
        status: 500,
        message: "Erro interno do servidor",
      };
    }
  }

  async updateRelatorio(
    relatorio: Relatorio
  ): Promise<{ status: number; data?: any; message?: string }> {
    try {
      const response = await fetch(
        `${this.baseURL}/relatorios/${relatorio.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(relatorio),
        }
      );

      const data = await response.json();

      if (response.ok) {
        return {
          status: 200,
          data: new Relatorio(
            data.id,
            data.titulo,
            data.descricao,
            data.tipo,
            data.projeto_id,
            data.usuario_id,
            data.data_inicio,
            data.data_fim,
            data.status,
            data.arquivo_url,
            data.created_at,
            data.updated_at,
            data.deleted
          ),
        };
      } else {
        return {
          status: response.status,
          message: data.message || "Erro ao atualizar relatório",
        };
      }
    } catch (error) {
      console.error("Erro ao atualizar relatório:", error);
      return {
        status: 500,
        message: "Erro interno do servidor",
      };
    }
  }

  async deleteRelatorio(
    id: number
  ): Promise<{ status: number; data?: any; message?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/relatorios/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        return {
          status: 200,
          message: "Relatório excluído com sucesso",
        };
      } else {
        const data = await response.json();
        return {
          status: response.status,
          message: data.message || "Erro ao excluir relatório",
        };
      }
    } catch (error) {
      console.error("Erro ao excluir relatório:", error);
      return {
        status: 500,
        message: "Erro interno do servidor",
      };
    }
  }

  async gerarRelatorio(
    relatorio: Relatorio
  ): Promise<{ status: number; data?: any; message?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/relatorios/gerar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(relatorio),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          status: 200,
          data: {
            ...data,
            arquivo_url: data.arquivo_url,
          },
        };
      } else {
        return {
          status: response.status,
          message: data.message || "Erro ao gerar relatório",
        };
      }
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      return {
        status: 500,
        message: "Erro interno do servidor",
      };
    }
  }
}

export default RelatorioData;
