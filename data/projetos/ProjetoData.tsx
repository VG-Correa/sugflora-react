import Projeto from "./Projeto";
import Message from "../../Messages/Message";

class ProjetoData {
  projetos: Projeto[] = [];

  constructor() {
    // Inicialização com projetos de exemplo se necessário
    this.projetos.push(
      new Projeto(1, "Projeto 1", "Descrição do Projeto 1", Date.now().toString(), Date.now().toString(), Date.now().toString(),1,1,null,"Ativo",Date.now().toString(),Date.now().toString(), false),
    )
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
    // console.log("Buscando projetos para o usuário:", usuario_dono_id);
    // console.log("Projetos disponíveis:", this.projetos);

    const projetos = this.projetos.filter(
      (projeto) =>
        projeto.usuario_dono_id === usuario_dono_id && !projeto.deleted
    );
    if (projetos.length > 0) {
      return new Message(200, "Projetos localizados", projetos);
    } else {
      return new Message(404, "Nenhum projeto encontrado para este usuário");
    }
  }

  public add(projeto: Projeto): Message<Projeto> {
    projeto.id = this.getLastId() + 1;
    projeto.created_at = new Date().toISOString();
    projeto.updated_at = new Date().toISOString();
    projeto.deleted = false;
    this.projetos.push(projeto);
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
    const projetosAtivos = this.projetos.filter((p) => !p.deleted);
    return new Message(200, undefined, projetosAtivos);
  }

}

export default ProjetoData;
