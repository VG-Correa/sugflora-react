class Campo {
  id: number | undefined;
  nome: string;
  descricao: string | null;
  data_inicio: string;
  data_termino: string | null;
  endereco: string;
  cidade: string;
  estado: string;
  pais: string;
  projeto_id: number;
  usuario_id: number;
  created_at: string;
  updated_at: string;
  deleted: boolean;

  constructor(
    id: number | undefined,
    nome: string,
    descricao: string | null,
    data_inicio: string,
    data_termino: string | null,
    endereco: string,
    cidade: string,
    estado: string,
    pais: string,
    projeto_id: number,
    usuario_id: number,
    created_at: string,
    updated_at: string,
    deleted: boolean = false
  ) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.data_inicio = data_inicio;
    this.data_termino = data_termino;
    this.endereco = endereco;
    this.cidade = cidade;
    this.estado = estado;
    this.pais = pais;
    this.projeto_id = projeto_id;
    this.usuario_id = usuario_id;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.deleted = deleted;
  }
}

export default Campo;
