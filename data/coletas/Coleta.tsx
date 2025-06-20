class Coleta {
  id: number | undefined;
  nome: string;
  campo_id: number;
  data_coleta: string;
  familia_id: number | null;
  genero_id: number | null;
  especie_id: number | null;
  nome_comum: string | null;
  identificada: boolean;
  imagens: string[] | null;
  observacoes: string | null;
  solicita_ajuda_identificacao: boolean;
  created_at: string;
  updated_at: string;
  deleted: boolean;

  constructor(
    id: number | undefined,
    nome: string,
    campo_id: number,
    data_coleta: string,
    familia_id: number | null,
    genero_id: number | null,
    especie_id: number | null,
    nome_comum: string | null,
    identificada: boolean,
    imagens: string[] | null,
    observacoes: string | null,
    solicita_ajuda_identificacao: boolean = false,
    created_at: string,
    updated_at: string,
    deleted: boolean = false
  ) {
    this.id = id;
    this.nome = nome;
    this.campo_id = campo_id;
    this.data_coleta = data_coleta;
    this.familia_id = familia_id;
    this.genero_id = genero_id;
    this.especie_id = especie_id;
    this.nome_comum = nome_comum;
    this.identificada = identificada;
    this.imagens = imagens;
    this.observacoes = observacoes;
    this.solicita_ajuda_identificacao = solicita_ajuda_identificacao;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.deleted = deleted;
  }
}

export default Coleta;
