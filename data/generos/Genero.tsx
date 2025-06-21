class Genero {
  id: number | undefined;
  nome: string;
  familia_id: number;
  descricao: string | null;
  created_at: string;
  updated_at: string;
  deleted: boolean;

  constructor(
    id: number | undefined,
    nome: string,
    familia_id: number,
    descricao: string | null,
    created_at: string,
    updated_at: string,
    deleted: boolean = false
  ) {
    this.id = id;
    this.nome = nome;
    this.familia_id = familia_id;
    this.descricao = descricao;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.deleted = deleted;
  }
}

export default Genero;
