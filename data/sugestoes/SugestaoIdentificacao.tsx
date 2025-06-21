class SugestaoIdentificacao {
  id: number | undefined;
  coleta_id: number;
  usuario_sugerente_id: number;
  especie_sugerida_id: number | null;
  genero_sugerido_id: number | null;
  familia_sugerida_id: number | null;
  nome_comum_sugerido: string | null;
  justificativa: string;
  confianca: number; // 1-5, onde 5 é muito confiante
  status: 'pendente' | 'aceita' | 'rejeitada' | 'em_analise';
  observacoes_adicionais: string | null;
  created_at: string;
  updated_at: string;
  deleted: boolean;

  constructor(
    id: number | undefined,
    coleta_id: number,
    usuario_sugerente_id: number,
    especie_sugerida_id: number | null,
    genero_sugerido_id: number | null,
    familia_sugerida_id: number | null,
    nome_comum_sugerido: string | null,
    justificativa: string,
    confianca: number,
    status: 'pendente' | 'aceita' | 'rejeitada' | 'em_analise' = 'pendente',
    observacoes_adicionais: string | null = null,
    created_at: string,
    updated_at: string,
    deleted: boolean = false
  ) {
    this.id = id;
    this.coleta_id = coleta_id;
    this.usuario_sugerente_id = usuario_sugerente_id;
    this.especie_sugerida_id = especie_sugerida_id;
    this.genero_sugerido_id = genero_sugerido_id;
    this.familia_sugerida_id = familia_sugerida_id;
    this.nome_comum_sugerido = nome_comum_sugerido;
    this.justificativa = justificativa;
    this.confianca = confianca;
    this.status = status;
    this.observacoes_adicionais = observacoes_adicionais;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.deleted = deleted;
  }
}

export default SugestaoIdentificacao; 