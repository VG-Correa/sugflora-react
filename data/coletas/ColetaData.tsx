import Coleta from "./Coleta";
import Message from "../../Messages/Message";

class ColetaData {
  private coletas: Coleta[] = [];

  public getAll(): Message<Coleta[]> {
    const coletasAtivas = this.coletas.filter((coleta) => !coleta.deleted);
    if (coletasAtivas.length > 0) {
      return new Message(200, "Coletas localizadas", coletasAtivas);
    } else {
      return new Message(404, "Nenhuma coleta encontrada");
    }
  }

  public getById(id: number): Message<Coleta> {
    const coleta = this.coletas.find((c) => c.id === id && !c.deleted);
    if (coleta) {
      return new Message(200, "Coleta localizada", coleta);
    } else {
      return new Message(404, "Coleta não encontrada");
    }
  }

  public getByCampoId(campo_id: number): Message<Coleta[]> {
    const coletas = this.coletas.filter(
      (coleta) => coleta.campo_id === campo_id && !coleta.deleted
    );
    if (coletas.length > 0) {
      return new Message(200, "Coletas localizadas", coletas);
    } else {
      return new Message(404, "Nenhuma coleta encontrada para este campo");
    }
  }

  public getIdentificadas(): Message<Coleta[]> {
    const coletas = this.coletas.filter(
      (coleta) => coleta.identificada && !coleta.deleted
    );
    if (coletas.length > 0) {
      return new Message(200, "Coletas identificadas localizadas", coletas);
    } else {
      return new Message(404, "Nenhuma coleta identificada encontrada");
    }
  }

  public getNaoIdentificadas(): Message<Coleta[]> {
    const coletas = this.coletas.filter(
      (coleta) => !coleta.identificada && !coleta.deleted
    );
    if (coletas.length > 0) {
      return new Message(200, "Coletas não identificadas localizadas", coletas);
    } else {
      return new Message(404, "Nenhuma coleta não identificada encontrada");
    }
  }

  public add(coleta: Coleta): Message<Coleta> {
    try {
      coleta.id = this.coletas.length + 1;
      coleta.created_at = new Date().toISOString();
      coleta.updated_at = new Date().toISOString();
      this.coletas.push(coleta);
      return new Message(201, "Coleta criada com sucesso", coleta);
    } catch (error) {
      return new Message(500, "Erro ao criar coleta");
    }
  }

  public update(coleta: Coleta): Message<Coleta> {
    try {
      const index = this.coletas.findIndex((c) => c.id === coleta.id);
      if (index !== -1) {
        coleta.updated_at = new Date().toISOString();
        this.coletas[index] = coleta;
        return new Message(200, "Coleta atualizada com sucesso", coleta);
      } else {
        return new Message(404, "Coleta não encontrada");
      }
    } catch (error) {
      return new Message(500, "Erro ao atualizar coleta");
    }
  }

  public delete(id: number): Message<boolean> {
    try {
      const index = this.coletas.findIndex((c) => c.id === id);
      if (index !== -1) {
        this.coletas[index].deleted = true;
        this.coletas[index].updated_at = new Date().toISOString();
        return new Message(200, "Coleta deletada com sucesso", true);
      } else {
        return new Message(404, "Coleta não encontrada");
      }
    } catch (error) {
      return new Message(500, "Erro ao deletar coleta");
    }
  }

  public identificar(id: number, especie_id: number): Message<Coleta> {
    try {
      const index = this.coletas.findIndex((c) => c.id === id);
      if (index !== -1) {
        this.coletas[index].especie_id = especie_id;
        this.coletas[index].identificada = true;
        this.coletas[index].updated_at = new Date().toISOString();
        return new Message(
          200,
          "Coleta identificada com sucesso",
          this.coletas[index]
        );
      } else {
        return new Message(404, "Coleta não encontrada");
      }
    } catch (error) {
      return new Message(500, "Erro ao identificar coleta");
    }
  }
}

export default ColetaData;
