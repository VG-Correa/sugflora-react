class Projeto {
  id: number | undefined;
  nome: string;
  descricao: string;
  inicio: string;
  previsaoConclusao: string | null;
  termino: string | null;
  responsavel_uuid: string | null;
  usuario_dono_uuid: string;
  imagemBase64: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  deleted: boolean;

  constructor(
    id: number | undefined,
    nome: string,
    descricao: string,
    inicio: string,
    previsaoConclusao: string | null,
    termino: string | null,
    responsavel_uuid: string | null,
    usuario_dono_uuid: string,
    imagemBase64: string | null,
    status: string,
    created_at: string,
    updated_at: string,
    deleted: boolean = false
  ) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.inicio = inicio;
    this.previsaoConclusao = previsaoConclusao;
    this.termino = termino;
    this.responsavel_uuid = responsavel_uuid;
    this.usuario_dono_uuid = usuario_dono_uuid;
    this.imagemBase64 = imagemBase64;
    this.status = status;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.deleted = deleted;
  }
}

export default Projeto;
