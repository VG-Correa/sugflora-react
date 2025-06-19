import Genero from "./Genero";
import Message from "../../Messages/Message";

class GeneroData {
  private generos: Genero[] = [];

  public getAll(): Message<Genero[]> {
    const generosAtivos = this.generos.filter((genero) => !genero.deleted);
    if (generosAtivos.length > 0) {
      return new Message(200, "Gêneros localizados", generosAtivos);
    } else {
      return new Message(404, "Nenhum gênero encontrado");
    }
  }

  public getById(id: number): Message<Genero> {
    const genero = this.generos.find((g) => g.id === id && !g.deleted);
    if (genero) {
      return new Message(200, "Gênero localizado", genero);
    } else {
      return new Message(404, "Gênero não encontrado");
    }
  }

  public getByFamilia(familia_id: number): Message<Genero[]> {
    const generos = this.generos.filter(
      (genero) => genero.familia_id === familia_id && !genero.deleted
    );
    if (generos.length > 0) {
      return new Message(200, "Gêneros localizados", generos);
    } else {
      return new Message(404, "Nenhum gênero encontrado para esta família");
    }
  }

  public add(genero: Genero): Message<Genero> {
    try {
      genero.id = this.generos.length + 1;
      genero.created_at = new Date().toISOString();
      genero.updated_at = new Date().toISOString();
      this.generos.push(genero);
      return new Message(201, "Gênero criado com sucesso", genero);
    } catch (error) {
      return new Message(500, "Erro ao criar gênero");
    }
  }

  public update(genero: Genero): Message<Genero> {
    try {
      const index = this.generos.findIndex((g) => g.id === genero.id);
      if (index !== -1) {
        genero.updated_at = new Date().toISOString();
        this.generos[index] = genero;
        return new Message(200, "Gênero atualizado com sucesso", genero);
      } else {
        return new Message(404, "Gênero não encontrado");
      }
    } catch (error) {
      return new Message(500, "Erro ao atualizar gênero");
    }
  }

  public delete(id: number): Message<boolean> {
    try {
      const index = this.generos.findIndex((g) => g.id === id);
      if (index !== -1) {
        this.generos[index].deleted = true;
        this.generos[index].updated_at = new Date().toISOString();
        return new Message(200, "Gênero deletado com sucesso", true);
      } else {
        return new Message(404, "Gênero não encontrado");
      }
    } catch (error) {
      return new Message(500, "Erro ao deletar gênero");
    }
  }
}

export default GeneroData;
