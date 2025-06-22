import Projeto from "./Projeto";
import Message from "../../Messages/Message";

class ProjetoData {
  projetos: Projeto[] = [];

  constructor() {
    // Adicionar dados de exemplo para testar a funcionalidade
    this.projetos.push(
      new Projeto(
        1,
        "Projeto Flora Amazônica",
        "Estudo da biodiversidade da flora amazônica",
        "2024-01-01",
        "2024-06-30",
        "2024-12-31",
        1, // responsavel_id
        1, // usuario_dono_id - Usuário 1
        "data:image/jpeg;base64,exemplo", // imagemBase64
        "Ativo", // status
        "2024-01-01T00:00:00Z", // created_at
        "2024-01-01T00:00:00Z", // updated_at
        false // deleted
      ),
      new Projeto(
        2,
        "Projeto Mata Atlântica",
        "Pesquisa sobre espécies endêmicas da Mata Atlântica",
        "2024-02-01",
        "2024-07-15",
        "2024-11-30",
        1, // responsavel_id
        1, // usuario_dono_id - Usuário 1
        "data:image/jpeg;base64,exemplo", // imagemBase64
        "Ativo", // status
        "2024-02-01T00:00:00Z", // created_at
        "2024-02-01T00:00:00Z", // updated_at
        false // deleted
      ),
      new Projeto(
        3,
        "Projeto Cerrado",
        "Estudo da biodiversidade do Cerrado",
        "2024-03-01",
        "2024-08-30",
        "2024-12-31",
        2, // responsavel_id
        2, // usuario_dono_id - Usuário 2
        "data:image/jpeg;base64,exemplo", // imagemBase64
        "Ativo", // status
        "2024-03-01T00:00:00Z", // created_at
        "2024-03-01T00:00:00Z", // updated_at
        false // deleted
      )
    );
    console.log("ProjetoData inicializado com projetos de exemplo");
  }

  getLastId(): number {
    if (this.projetos.length === 0) {
      return 0;
    } else {
      const id: number | undefined = this.projetos[this.projetos.length - 1].id;
      return id ? id : 0;
    }
  }

  public getById(id: number): Message<Projeto> {
    const projeto = this.projetos.find(
      (projeto) => projeto.id === id && !projeto.deleted
    );
    if (projeto != undefined) {
      return new Message(200, "Projeto localizado", projeto);
    } else {
      return new Message(404, "Projeto não localizado");
    }
  }

  public getByUsuarioDono(usuario_dono_id: number): Message<Projeto[]> {
    console.log("Buscando projetos para o usuário:", usuario_dono_id);
    console.log("Projetos disponíveis:", this.projetos);
    console.log("Tipos dos IDs:", this.projetos.map(p => ({ id: p.id, usuario_dono_id: p.usuario_dono_id, tipo_usuario: typeof p.usuario_dono_id })));

    const projetos = this.projetos.filter(
      (projeto) =>
        projeto.usuario_dono_id === usuario_dono_id && !projeto.deleted
    );
    console.log("Projetos filtrados:", projetos);
    
    if (projetos.length > 0) {
      return new Message(200, "Projetos localizados", projetos);
    } else {
      return new Message(404, "Nenhum projeto encontrado para este usuário");
    }
  }

  public add(projeto: Projeto): Message<Projeto> {
    console.log("Adicionando projeto:", projeto);
    console.log("Projetos antes da adição:", this.projetos.length);
    
    projeto.id = this.getLastId() + 1;
    projeto.created_at = new Date().toISOString();
    projeto.updated_at = new Date().toISOString();
    projeto.deleted = false;
    
    console.log("Projeto após configuração:", projeto);
    
    this.projetos.push(projeto);
    
    console.log("Projetos após adição:", this.projetos.length);
    console.log("Todos os projetos:", this.projetos);
    
    return new Message(201, "Projeto criado com sucesso", projeto);
  }

  public update(projeto: Projeto): Message<Projeto> {
    const index = this.projetos.findIndex(
      (p) => p.id === projeto.id && !p.deleted
    );

    if (index !== -1) {
      projeto.updated_at = new Date().toISOString();
      this.projetos[index] = { ...this.projetos[index], ...projeto };
      return new Message(
        200,
        "Projeto atualizado com sucesso",
        this.projetos[index]
      );
    } else {
      return new Message(404, "Projeto não encontrado para atualização");
    }
  }

  public delete(id: number): Message<boolean> {
    const index = this.projetos.findIndex((p) => p.id === id && !p.deleted);

    if (index !== -1) {
      this.projetos[index].deleted = true;
      this.projetos[index].updated_at = new Date().toISOString();
      return new Message(200, "Projeto deletado com sucesso", true);
    } else {
      return new Message(404, "Projeto não encontrado para exclusão", false);
    }
  }

  public getAll(): Message<Projeto[]> {
    console.log("getAll chamado - todos os projetos:", this.projetos);
    const projetosAtivos = this.projetos.filter((p) => !p.deleted);
    console.log("Projetos ativos (não deletados):", projetosAtivos);
    return new Message(200, undefined, projetosAtivos);
  }

}

export default ProjetoData;
