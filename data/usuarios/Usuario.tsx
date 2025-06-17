
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

  constructor(id: number | undefined, nome: string, sobrenome: string, username: string, senha: string, rg: string, cpf: string, endereco: string, email: string, role: string) {
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
  }

}


export default Usuario