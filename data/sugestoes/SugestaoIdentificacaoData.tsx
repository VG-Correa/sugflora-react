import SugestaoIdentificacao from "./SugestaoIdentificacao";
import Message from "../../Messages/Message";

class SugestaoIdentificacaoData {
  private sugestoes: SugestaoIdentificacao[] = [];

  constructor() {
    // Dados de exemplo para testar a funcionalidade
    this.sugestoes.push(
      new SugestaoIdentificacao(
        1,
        3, // coleta_id - Coleta 3 que solicita ajuda
        2, // usuario_sugerente_id
        1, // especie_sugerida_id
        1, // genero_sugerido_id
        1, // familia_sugerida_id
        "Espécie A Comum", // nome_comum_sugerido
        "Baseado nas características das folhas e flores, parece ser da família Fabaceae. As folhas são compostas e as flores têm formato típico de leguminosas.",
        4, // confianca
        "pendente", // status
        "Observação adicional sobre a distribuição geográfica",
        "2024-01-20T10:00:00Z", // created_at
        "2024-01-20T10:00:00Z", // updated_at
        false // deleted
      ),
      new SugestaoIdentificacao(
        2,
        3, // coleta_id - Coleta 3 que solicita ajuda
        3, // usuario_sugerente_id
        2, // especie_sugerida_id
        2, // genero_sugerido_id
        2, // familia_sugerida_id
        "Espécie B Rara", // nome_comum_sugerido
        "As características morfológicas sugerem que pode ser uma espécie rara da família Myrtaceae. As flores apresentam características típicas do gênero.",
        3, // confianca
        "pendente", // status
        null, // observacoes_adicionais
        "2024-01-21T14:30:00Z", // created_at
        "2024-01-21T14:30:00Z", // updated_at
        false // deleted
      )
    );
  }

  public getAll(): Message<SugestaoIdentificacao[]> {
    const sugestoesAtivas = this.sugestoes.filter((sugestao) => !sugestao.deleted);
    if (sugestoesAtivas.length > 0) {
      return new Message(200, "Sugestões localizadas", sugestoesAtivas);
    } else {
      return new Message(404, "Nenhuma sugestão encontrada");
    }
  }

  public getById(id: number): Message<SugestaoIdentificacao> {
    const sugestao = this.sugestoes.find((s) => s.id === id && !s.deleted);
    if (sugestao) {
      return new Message(200, "Sugestão localizada", sugestao);
    } else {
      return new Message(404, "Sugestão não encontrada");
    }
  }

  public getByColetaId(coleta_id: number): Message<SugestaoIdentificacao[]> {
    const sugestoes = this.sugestoes.filter(
      (sugestao) => sugestao.coleta_id === coleta_id && !sugestao.deleted
    );
    if (sugestoes.length > 0) {
      return new Message(200, "Sugestões localizadas", sugestoes);
    } else {
      return new Message(404, "Nenhuma sugestão encontrada para esta coleta");
    }
  }

  public getByUsuarioId(usuario_id: number): Message<SugestaoIdentificacao[]> {
    const sugestoes = this.sugestoes.filter(
      (sugestao) => sugestao.usuario_sugerente_id === usuario_id && !sugestao.deleted
    );
    if (sugestoes.length > 0) {
      return new Message(200, "Sugestões localizadas", sugestoes);
    } else {
      return new Message(404, "Nenhuma sugestão encontrada para este usuário");
    }
  }

  public getPendentes(): Message<SugestaoIdentificacao[]> {
    const sugestoes = this.sugestoes.filter(
      (sugestao) => sugestao.status === 'pendente' && !sugestao.deleted
    );
    if (sugestoes.length > 0) {
      return new Message(200, "Sugestões pendentes localizadas", sugestoes);
    } else {
      return new Message(404, "Nenhuma sugestão pendente encontrada");
    }
  }

  public add(sugestao: SugestaoIdentificacao): Message<SugestaoIdentificacao> {
    try {
      sugestao.id = this.sugestoes.length + 1;
      sugestao.created_at = new Date().toISOString();
      sugestao.updated_at = new Date().toISOString();
      this.sugestoes.push(sugestao);
      return new Message(201, "Sugestão criada com sucesso", sugestao);
    } catch (error) {
      return new Message(500, "Erro ao criar sugestão");
    }
  }

  public update(sugestao: SugestaoIdentificacao): Message<SugestaoIdentificacao> {
    try {
      const index = this.sugestoes.findIndex((s) => s.id === sugestao.id);
      if (index !== -1) {
        sugestao.updated_at = new Date().toISOString();
        this.sugestoes[index] = sugestao;
        return new Message(200, "Sugestão atualizada com sucesso", sugestao);
      } else {
        return new Message(404, "Sugestão não encontrada");
      }
    } catch (error) {
      return new Message(500, "Erro ao atualizar sugestão");
    }
  }

  public delete(id: number): Message<boolean> {
    try {
      const index = this.sugestoes.findIndex((s) => s.id === id);
      if (index !== -1) {
        this.sugestoes[index].deleted = true;
        this.sugestoes[index].updated_at = new Date().toISOString();
        return new Message(200, "Sugestão deletada com sucesso", true);
      } else {
        return new Message(404, "Sugestão não encontrada");
      }
    } catch (error) {
      return new Message(500, "Erro ao deletar sugestão");
    }
  }

  public updateStatus(id: number, status: 'pendente' | 'aceita' | 'rejeitada' | 'em_analise'): Message<SugestaoIdentificacao> {
    try {
      const index = this.sugestoes.findIndex((s) => s.id === id);
      if (index !== -1) {
        this.sugestoes[index].status = status;
        this.sugestoes[index].updated_at = new Date().toISOString();
        
        // Se a sugestão foi aceita, atualizar a coleta correspondente
        if (status === 'aceita') {
          const sugestao = this.sugestoes[index];
          
          // Importar o serviço de coletas para atualizar a coleta
          const ColetaData = require('../coletas/ColetaData').default;
          const coletaService = new ColetaData();
          
          // Atualizar a coleta com os dados da sugestão aceita
          const resultadoColeta = coletaService.atualizarComSugestaoAceita(
            sugestao.coleta_id,
            sugestao.familia_sugerida_id,
            sugestao.genero_sugerido_id,
            sugestao.especie_sugerida_id,
            sugestao.nome_comum_sugerido
          );
          
          if (resultadoColeta.status !== 200) {
            console.error('Erro ao atualizar coleta:', resultadoColeta.message);
          }
        }
        
        return new Message(200, "Status da sugestão atualizado com sucesso", this.sugestoes[index]);
      } else {
        return new Message(404, "Sugestão não encontrada");
      }
    } catch (error) {
      return new Message(500, "Erro ao atualizar status da sugestão");
    }
  }

  // Método para buscar sugestões com informações completas (incluindo dados relacionados)
  public getSugestoesCompletas(): Message<any[]> {
    const sugestoesAtivas = this.sugestoes.filter((sugestao) => !sugestao.deleted);
    
    if (sugestoesAtivas.length > 0) {
      // Aqui você pode adicionar lógica para buscar dados relacionados
      // como informações do usuário, coleta, espécie, etc.
      return new Message(200, "Sugestões completas localizadas", sugestoesAtivas);
    } else {
      return new Message(404, "Nenhuma sugestão encontrada");
    }
  }
}

export default SugestaoIdentificacaoData; 