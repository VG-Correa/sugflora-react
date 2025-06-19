import Especie from "./Especie";
import Message from "../../Messages/Message";

class EspecieData {
  private especies: Especie[] = [];

  public getAll(): Message<Especie[]> {
    const especiesAtivas = this.especies.filter((especie) => !especie.deleted);
    if (especiesAtivas.length > 0) {
      return new Message(200, "Espécies localizadas", especiesAtivas);
    } else {
      return new Message(404, "Nenhuma espécie encontrada");
    }
  }

  public getById(id: number): Message<Especie> {
    const especie = this.especies.find((e) => e.id === id && !e.deleted);
    if (especie) {
      return new Message(200, "Espécie localizada", especie);
    } else {
      return new Message(404, "Espécie não encontrada");
    }
  }

  public getByGenero(genero_id: number): Message<Especie[]> {
    const especies = this.especies.filter(
      (especie) => especie.genero_id === genero_id && !especie.deleted
    );
    if (especies.length > 0) {
      return new Message(200, "Espécies localizadas", especies);
    } else {
      return new Message(404, "Nenhuma espécie encontrada para este gênero");
    }
  }

  public searchByNome(nome: string): Message<Especie[]> {
    const especies = this.especies.filter(
      (especie) =>
        especie.nome.toLowerCase().includes(nome.toLowerCase()) &&
        !especie.deleted
    );
    if (especies.length > 0) {
      return new Message(200, "Espécies localizadas", especies);
    } else {
      return new Message(404, "Nenhuma espécie encontrada com este nome");
    }
  }

  public add(especie: Especie): Message<Especie> {
    try {
      especie.id = this.especies.length + 1;
      especie.created_at = new Date().toISOString();
      especie.updated_at = new Date().toISOString();
      this.especies.push(especie);
      return new Message(201, "Espécie criada com sucesso", especie);
    } catch (error) {
      return new Message(500, "Erro ao criar espécie");
    }
  }

  public update(especie: Especie): Message<Especie> {
    try {
      const index = this.especies.findIndex((e) => e.id === especie.id);
      if (index !== -1) {
        especie.updated_at = new Date().toISOString();
        this.especies[index] = especie;
        return new Message(200, "Espécie atualizada com sucesso", especie);
      } else {
        return new Message(404, "Espécie não encontrada");
      }
    } catch (error) {
      return new Message(500, "Erro ao atualizar espécie");
    }
  }

  public delete(id: number): Message<boolean> {
    try {
      const index = this.especies.findIndex((e) => e.id === id);
      if (index !== -1) {
        this.especies[index].deleted = true;
        this.especies[index].updated_at = new Date().toISOString();
        return new Message(200, "Espécie deletada com sucesso", true);
      } else {
        return new Message(404, "Espécie não encontrada");
      }
    } catch (error) {
      return new Message(500, "Erro ao deletar espécie");
    }
  }
}

export default EspecieData;
