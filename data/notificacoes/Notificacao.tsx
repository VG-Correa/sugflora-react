class Notificacao {
  id: number | undefined;
  titulo: string;
  mensagem: string;
  tipo: string; // 'sistema', 'ajuda', 'identificacao', etc.
  usuario_id: string;
  lida: boolean;
  data_envio: string;
  data_leitura: string | null;
  created_at: string;
  updated_at: string;
  deleted: boolean;

  constructor(
    id: number | undefined,
    titulo: string,
    mensagem: string,
    tipo: string,
    usuario_id: string,
    lida: boolean,
    data_envio: string,
    data_leitura: string | null,
    created_at: string,
    updated_at: string,
    deleted: boolean = false
  ) {
    this.id = id;
    this.titulo = titulo;
    this.mensagem = mensagem;
    this.tipo = tipo;
    this.usuario_id = usuario_id;
    this.lida = lida;
    this.data_envio = data_envio;
    this.data_leitura = data_leitura;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.deleted = deleted;
  }
}

export default Notificacao;
