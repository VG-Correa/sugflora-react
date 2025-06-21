class Relatorio {
  id: number | undefined;
  titulo: string;
  descricao?: string;
  tipo: string; // 'quantitativo', 'qualitativo', 'biodiversidade'
  projeto_id: number;
  usuario_id: number;
  data_inicio?: string;
  data_fim?: string;
  status?: string;
  arquivo_url?: string;
  created_at: string;
  updated_at: string;
  deleted: boolean;

  constructor(
    id: number | undefined,
    titulo: string,
    descricao: string | undefined,
    tipo: string,
    projeto_id: number,
    usuario_id: number,
    data_inicio: string | undefined,
    data_fim: string | undefined,
    status: string | undefined,
    arquivo_url: string | undefined,
    created_at: string,
    updated_at: string,
    deleted: boolean = false
  ) {
    this.id = id;
    this.titulo = titulo;
    this.descricao = descricao;
    this.tipo = tipo;
    this.projeto_id = projeto_id;
    this.usuario_id = usuario_id;
    this.data_inicio = data_inicio;
    this.data_fim = data_fim;
    this.status = status;
    this.arquivo_url = arquivo_url;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.deleted = deleted;
  }
}

export default Relatorio;
