import Relatorio from "./Relatorio";
import Message from "../../Messages/Message";
import AsyncStorage from "@react-native-async-storage/async-storage";

class RelatorioData {
  relatorios: Relatorio[] = [];
  private readonly STORAGE_KEY = "sugflora_relatorios";

  constructor() {
    console.log("RelatorioData inicializado");
    this.loadFromStorage();
  }

  private async loadFromStorage() {
    try {
      console.log("Carregando relatórios do AsyncStorage...");
      const storedData = await AsyncStorage.getItem(this.STORAGE_KEY);
      console.log("Dados encontrados no storage:", storedData ? "sim" : "não");
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log("Dados parseados:", parsedData);
        
        this.relatorios = parsedData.map((r: any) => 
          new Relatorio(
            r.id,
            r.titulo,
            r.descricao,
            r.tipo,
            r.projeto_id,
            r.usuario_id,
            r.data_inicio,
            r.data_fim,
            r.status,
            r.arquivo_url,
            r.created_at,
            r.updated_at,
            r.deleted
          )
        );
        console.log("Relatórios carregados do storage:", this.relatorios.length);
        console.log("Relatórios:", this.relatorios);
      } else {
        console.log("Nenhum relatório encontrado no storage");
        this.relatorios = [];
      }
    } catch (error) {
      console.error("Erro ao carregar relatórios do storage:", error);
      this.relatorios = [];
    }
  }

  private async saveToStorage() {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.relatorios));
      console.log("Relatórios salvos no storage:", this.relatorios.length);
    } catch (error) {
      console.error("Erro ao salvar relatórios no storage:", error);
    }
  }

  getLastId(): number {
    if (this.relatorios.length === 0) {
      return 0;
    } else {
      const id: number | undefined = this.relatorios[this.relatorios.length - 1].id;
      return id ? id : 0;
    }
  }

  async getAllRelatorios(): Promise<{
    status: number;
    data?: any;
    message?: string;
  }> {
    try {
      console.log("getAllRelatorios chamado - todos os relatórios:", this.relatorios);
      const relatoriosAtivos = this.relatorios.filter((r) => !r.deleted);
      console.log("Relatórios ativos (não deletados):", relatoriosAtivos);
      
      return {
        status: 200,
        data: relatoriosAtivos,
        message: "Relatórios localizados"
      };
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
      const relatorio = this.relatorios.find(
        (r) => r.id === id && !r.deleted
      );
      
      if (relatorio) {
        return {
          status: 200,
          data: relatorio,
          message: "Relatório localizado"
        };
      } else {
        return {
          status: 404,
          message: "Relatório não localizado"
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
      const relatorios = this.relatorios.filter(
        (r) => r.projeto_id === projetoId && !r.deleted
      );
      
      return {
        status: 200,
        data: relatorios,
        message: "Relatórios do projeto localizados"
      };
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
      const relatorios = this.relatorios.filter(
        (r) => r.usuario_id === usuarioId && !r.deleted
      );
      
      return {
        status: 200,
        data: relatorios,
        message: "Relatórios do usuário localizados"
      };
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
      console.log("Criando relatório:", relatorio);
      console.log("Relatórios antes da criação:", this.relatorios.length);
      
      relatorio.id = this.getLastId() + 1;
      relatorio.created_at = new Date().toISOString();
      relatorio.updated_at = new Date().toISOString();
      relatorio.deleted = false;
      
      console.log("Relatório após configuração:", relatorio);
      
      this.relatorios.push(relatorio);
      
      // Salvar no storage
      await this.saveToStorage();
      
      console.log("Relatórios após criação:", this.relatorios.length);
      console.log("Todos os relatórios:", this.relatorios);
      
      return {
        status: 200,
        data: relatorio,
        message: "Relatório criado com sucesso"
      };
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
      const index = this.relatorios.findIndex(
        (r) => r.id === relatorio.id && !r.deleted
      );

      if (index !== -1) {
        relatorio.updated_at = new Date().toISOString();
        this.relatorios[index] = { ...this.relatorios[index], ...relatorio };
        
        // Salvar no storage
        await this.saveToStorage();
        
        return {
          status: 200,
          data: this.relatorios[index],
          message: "Relatório atualizado com sucesso"
        };
      } else {
        return {
          status: 404,
          message: "Relatório não encontrado para atualização"
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
      const index = this.relatorios.findIndex((r) => r.id === id && !r.deleted);

      if (index !== -1) {
        this.relatorios[index].deleted = true;
        this.relatorios[index].updated_at = new Date().toISOString();
        
        // Salvar no storage
        await this.saveToStorage();
        
        return {
          status: 200,
          message: "Relatório excluído com sucesso"
        };
      } else {
        return {
          status: 404,
          message: "Relatório não encontrado para exclusão"
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
      // Simular geração de relatório
      const relatorioGerado = {
        ...relatorio,
        arquivo_url: `relatorio_${relatorio.id}_${Date.now()}.pdf`,
        status: "gerado"
      };
      
      return {
        status: 200,
        data: relatorioGerado,
        message: "Relatório gerado com sucesso"
      };
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
