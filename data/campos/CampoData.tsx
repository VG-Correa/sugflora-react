import Campo from "./Campo";
import Message from "../../Messages/Message";

class CampoData {
  private campos: Campo[] = [];

  constructor() {
    this.campos.push(
      new Campo(1, "Campo 1", "Descrição do Campo 1", "2023-01-01T00:00:00Z", "2023-01-02T00:00:00Z", "Rua tal","Ferraz", "SP", "Brasil", 1, 1, "2023-01-03T00:00:00Z", "usuario_1", false),
    )
  }

  public getAll(): Message<Campo[]> {
    const camposAtivos = this.campos.filter((campo) => !campo.deleted);
    if (camposAtivos.length > 0) {
      return new Message(200, "Campos localizados", camposAtivos);
    } else {
      return new Message(404, "Nenhum campo encontrado");
    }
  }

  public getById(id: number): Message<Campo> {
    const campo = this.campos.find((c) => c.id === id && !c.deleted);
    if (campo) {
      return new Message(200, "Campo localizado", campo);
    } else {
      return new Message(404, "Campo não encontrado");
    }
  }

  public getByUsuarioId(usuario_id: number): Message<Campo[]> {
    const campos = this.campos.filter(
      (campo) => campo.usuario_id === usuario_id && !campo.deleted
    );
    if (campos.length > 0) {
      return new Message(200, "Campos localizados", campos);
    } else {
      return new Message(404, "Nenhum campo encontrado para este usuário");
    }
  }

  public getByProjetoId(projeto_id: number): Message<Campo[]> {
    const campos = this.campos.filter(
      (campo) => campo.projeto_id === projeto_id && !campo.deleted
    );
    if (campos.length > 0) {
      return new Message(200, "Campos localizados", campos);
    } else {
      return new Message(404, "Nenhum campo encontrado para este projeto");
    }
  }

  public add(campo: Campo): Message<Campo> {
    try {
      campo.id = this.campos.length + 1;
      campo.created_at = new Date().toISOString();
      campo.updated_at = new Date().toISOString();
      this.campos.push(campo);
      return new Message(201, "Campo criado com sucesso", campo);
    } catch (error) {
      return new Message(500, "Erro ao criar campo");
    }
  }

  public update(campo: Campo): Message<Campo> {
    try {
      const index = this.campos.findIndex((c) => c.id === campo.id);
      if (index !== -1) {
        campo.updated_at = new Date().toISOString();
        this.campos[index] = campo;
        return new Message(200, "Campo atualizado com sucesso", campo);
      } else {
        return new Message(404, "Campo não encontrado");
      }
    } catch (error) {
      return new Message(500, "Erro ao atualizar campo");
    }
  }

  public delete(id: number): Message<boolean> {
    try {
      const index = this.campos.findIndex((c) => c.id === id);
      if (index !== -1) {
        this.campos[index].deleted = true;
        this.campos[index].updated_at = new Date().toISOString();
        return new Message(200, "Campo deletado com sucesso", true);
      } else {
        return new Message(404, "Campo não encontrado");
      }
    } catch (error) {
      return new Message(500, "Erro ao deletar campo");
    }
  }

  public syncCampos(campos: Campo[]): void {
    this.campos = [...campos];
  }
}

export default CampoData;
