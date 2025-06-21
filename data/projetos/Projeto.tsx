class Projeto {
  id: number | undefined;
  nome: string;
  descricao: string;
  inicio: string;
  previsaoConclusao: string | null;
  termino: string | null;
  responsavel_id: number | null;
  usuario_dono_id: number;
  imagemBase64: string | null;
  status: "Ativo" | "Inativo" | "Concluído" | "Cancelado" = "Ativo";
  created_at: string;
  updated_at: string;
  deleted: boolean;

  constructor(
    id: number | undefined = undefined,
    nome: string = "",
    descricao: string = "",
    inicio: string = "",
    previsaoConclusao: string | null = null,
    termino: string | null = null,
    responsavel_id: number | null = null,
    usuario_dono_id: number = 0,
    imagemBase64: string | null = null,
    status: "Ativo" | "Inativo" | "Concluído" | "Cancelado" = "Ativo",
    created_at: string = "",
    updated_at: string = "",
    deleted: boolean = false
  ) {
    console.log("Construtor Projeto chamado com parâmetros:", {
      id, nome, descricao, inicio, previsaoConclusao, termino, 
      responsavel_id, usuario_dono_id, imagemBase64, status, 
      created_at, updated_at, deleted
    });
    
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.inicio = inicio;
    this.previsaoConclusao = previsaoConclusao;
    this.termino = termino;
    this.responsavel_id = responsavel_id;
    this.usuario_dono_id = usuario_dono_id;
    this.imagemBase64 = imagemBase64;
    this.status = status;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.deleted = deleted;
    
    console.log("Projeto criado:", this);
  }
}

export default Projeto;
