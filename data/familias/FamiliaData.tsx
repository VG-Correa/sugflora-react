import Familia from "./Familia";
import Message from "../../Messages/Message";

class FamiliaData {
  private familias: Familia[] = [];

  constructor() {

    this.familias.push(
      new Familia(1, "Fabaceae", "Uma planta leguminosa", "2025-06-20T00:00:00Z", "2025-06-20T00:00:00Z", false),
      new Familia(2, "Poaceae", "Uma planta gramínea", "2025-06-20T00:00:00Z", "2025-06-20T00:00:00Z", false),
      new Familia(3, "Asteraceae", "Uma planta herbácea", "2025-06-20T00:00:00Z", "2025-06-20T00:00:00Z", false)
    );

  }

  public getAll(): Message<Familia[]> {
    const familiasAtivas = this.familias.filter((familia) => !familia.deleted);
    if (familiasAtivas.length > 0) {
      return new Message(200, "Famílias localizadas", familiasAtivas);
    } else {
      return new Message(404, "Nenhuma família encontrada");
    }
  }

  public getById(id: number): Message<Familia> {
    const familia = this.familias.find((f) => f.id === id && !f.deleted);
    if (familia) {
      return new Message(200, "Família localizada", familia);
    } else {
      return new Message(404, "Família não encontrada");
    }
  }

  public add(familia: Familia): Message<Familia> {
    try {
      familia.id = this.familias.length + 1;
      familia.created_at = new Date().toISOString();
      familia.updated_at = new Date().toISOString();
      this.familias.push(familia);
      return new Message(201, "Família criada com sucesso", familia);
    } catch (error) {
      return new Message(500, "Erro ao criar família");
    }
  }

  public update(familia: Familia): Message<Familia> {
    try {
      const index = this.familias.findIndex((f) => f.id === familia.id);
      if (index !== -1) {
        familia.updated_at = new Date().toISOString();
        this.familias[index] = familia;
        return new Message(200, "Família atualizada com sucesso", familia);
      } else {
        return new Message(404, "Família não encontrada");
      }
    } catch (error) {
      return new Message(500, "Erro ao atualizar família");
    }
  }

  public delete(id: number): Message<boolean> {
    try {
      const index = this.familias.findIndex((f) => f.id === id);
      if (index !== -1) {
        this.familias[index].deleted = true;
        this.familias[index].updated_at = new Date().toISOString();
        return new Message(200, "Família deletada com sucesso", true);
      } else {
        return new Message(404, "Família não encontrada");
      }
    } catch (error) {
      return new Message(500, "Erro ao deletar família");
    }
  }
}

export default FamiliaData;
