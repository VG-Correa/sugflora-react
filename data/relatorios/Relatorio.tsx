class Relatorio {
  id: number | undefined;
  titulo: string;
  tipo: string; // 'quantitativo', 'qualitativo'
  projeto_id: number;
  campo_id: number | null;
  periodo_inicio: string;
  periodo_fim: string;
  dados: any; // JSON com os dados do relatório
  usuario_gerador_id: string;
  created_at: string;
  updated_at: string;
  deleted: boolean;

  constructor(
    id: number | undefined,
    titulo: string,
    tipo: string,
    projeto_id: number,
    campo_id: number | null,
    periodo_inicio: string,
    periodo_fim: string,
    dados: any,
    usuario_gerador_id: string,
    created_at: string,
    updated_at: string,
    deleted: boolean = false
  ) {
    this.id = id;
    this.titulo = titulo;
    this.tipo = tipo;
    this.projeto_id = projeto_id;
    this.campo_id = campo_id;
    this.periodo_inicio = periodo_inicio;
    this.periodo_fim = periodo_fim;
    this.dados = dados;
    this.usuario_gerador_id = usuario_gerador_id;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.deleted = deleted;
  }
}

export default Relatorio;
