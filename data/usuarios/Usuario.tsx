class Usuario {
  id: number | undefined;
  nome: string;
  sobrenome: string;
  username: string;
  senha: string;
  rg: string;
  cpf: string;
  endereco: string;
  email: string;
  role: string;
  created_at?: string;
  updated_at?: string;
  deleted: boolean = false;
  deleted_at?: string;

  constructor(
    id: number | undefined,
    nome: string,
    sobrenome: string,
    username: string,
    senha: string,
    rg: string,
    cpf: string,
    endereco: string,
    email: string,
    role: string,
    created_at?: string,
    updated_at?: string
  ) {
    this.id = id;
    this.nome = nome;
    this.sobrenome = sobrenome;
    this.username = username;
    this.senha = senha;
    this.rg = rg;
    this.cpf = cpf;
    this.endereco = endereco;
    this.email = email;
    this.role = role;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.deleted = false;
    this.deleted_at = undefined;
  }
}

export default Usuario;
