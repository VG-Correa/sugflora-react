import Coleta from "./Coleta";
import Message from "../../Messages/Message";

class ColetaData {
  private coletas: Coleta[] = [];

  constructor() {
    // Adicionar dados de exemplo para testar a funcionalidade
    this.coletas.push(
      new Coleta(
        1,
        "Coleta 1 - Espécie A",
        1, // campo_id
        "2024-01-15T10:00:00Z",
        null, // familia_id
        null, // genero_id
        null, // especie_id
        "Espécie A", // nome_comum
        false, // identificada
        ["imagem1.jpg"], // imagens
        "Observações da coleta 1", // observacoes
        false, // solicita_ajuda_identificacao
        "2024-01-15T10:00:00Z", // created_at
        "2024-01-15T10:00:00Z", // updated_at
        false // deleted
      ),
      new Coleta(
        2,
        "Coleta 2 - Espécie B",
        1, // campo_id
        "2024-01-16T14:30:00Z",
        null, // familia_id
        null, // genero_id
        1, // especie_id
        "Espécie B", // nome_comum
        true, // identificada
        ["imagem2.jpg"], // imagens
        "Observações da coleta 2", // observacoes
        false, // solicita_ajuda_identificacao
        "2024-01-16T14:30:00Z", // created_at
        "2024-01-16T14:30:00Z", // updated_at
        false // deleted
      ),
      new Coleta(
        3,
        "Coleta 3 - Espécie C",
        2, // campo_id
        "2024-01-17T09:15:00Z",
        null, // familia_id
        null, // genero_id
        null, // especie_id
        "Espécie C", // nome_comum
        false, // identificada
        ["imagem3.jpg"], // imagens
        "Observações da coleta 3", // observacoes
        true, // solicita_ajuda_identificacao
        "2024-01-17T09:15:00Z", // created_at
        "2024-01-17T09:15:00Z", // updated_at
        false // deleted
      ),
      new Coleta(
        4,
        "Coleta 4 - Espécie D",
        3, // campo_id
        "2024-01-18T16:45:00Z",
        null, // familia_id
        null, // genero_id
        2, // especie_id
        "Espécie D", // nome_comum
        true, // identificada
        ["imagem4.jpg"], // imagens
        "Observações da coleta 4", // observacoes
        false, // solicita_ajuda_identificacao
        "2024-01-18T16:45:00Z", // created_at
        "2024-01-18T16:45:00Z", // updated_at
        false // deleted
      )
    );
  }

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
