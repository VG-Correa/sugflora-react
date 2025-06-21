class Especie {
  id: number | undefined;
  nome: string;
  nome_comum: string | null;
  genero_id: number;
  descricao: string | null;
  caracteristicas: string | null;
  habitat: string | null;
  distribuicao_geografica: string | null;
  status_conservacao: string | null;
  imagens: string[] | null;
  created_at: string;
  updated_at: string;
  deleted: boolean;

  constructor(
    id: number | undefined,
    nome: string,
    nome_comum: string | null,
    genero_id: number,
    descricao: string | null,
    caracteristicas: string | null,
    habitat: string | null,
    distribuicao_geografica: string | null,
    status_conservacao: string | null,
    imagens: string[] | null,
    created_at: string,
    updated_at: string,
    deleted: boolean = false
  ) {
    this.id = id;
    this.nome = nome;
    this.nome_comum = nome_comum;
    this.genero_id = genero_id;
    this.descricao = descricao;
    this.caracteristicas = caracteristicas;
    this.habitat = habitat;
    this.distribuicao_geografica = distribuicao_geografica;
    this.status_conservacao = status_conservacao;
    this.imagens = imagens;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.deleted = deleted;
  }
}

export default Especie;
