import Especie from "./Especie";
import Message from "../../Messages/Message";

class EspecieData {
  private especies: Especie[] = [];

  constructor() {
    this.especies.push(
      // Espécies do gênero Phaseolus (idGenero = 1)
      new Especie(1, "Phaseolus vulgaris", "Feijão-comum", 1, "Espécie de feijão amplamente cultivada", "Planta anual, folhas trifoliadas, vagens", "Campos e hortas", "Américas, hoje global", "LC", [], "2025-06-20T00:00:00Z", "2025-06-20T00:00:00Z", false),
      new Especie(2, "Phaseolus lunatus", "Feijão-lima", 1, "Feijão com vagens largas", "Planta anual, folhas trifoliadas", "Regiões tropicais/subtropicais", "Américas", "LC", [], "2025-06-20T00:00:00Z", "2025-06-20T00:00:00Z", false),
      new Especie(3, "Phaseolus coccineus", "Feijão-vagem", 1, "Feijão com vagens vermelhas", "Vinha perene", "Cultivo", "Américas", "LC", [], "2025-06-20T00:00:00Z", "2025-06-20T00:00:00Z", false),

      // Espécies do gênero Mimosa (idGenero = 2)
      new Especie(4, "Mimosa pudica", "Sensitiva", 2, "Planta sensível ao toque", "Folhas que fecham ao toque", "Áreas tropicais", "Américas, naturalizada", "LC", [], "2025-06-20T00:00:00Z", "2025-06-20T00:00:00Z", false),
      new Especie(5, "Mimosa tenuiflora", "Jurema-preta", 2, "Usada em rituais com DMT", "Arbusto de pequeno porte", "Caatinga, cerrado", "América do Sul", "LC", [], "2025-06-20T00:00:00Z", "2025-06-20T00:00:00Z", false),

      // Espécies do gênero Acacia (idGenero = 3)
      new Especie(6, "Acacia dealbata", "Acácia-prateada", 3, "Árvore ornamental com flores amarelas", "Árvore até 30m, folhas bipinadas", "Encostas e matas", "Austrália (naturalizada em vários lugares)", "LC", [], "2025-06-20T00:00:00Z", "2025-06-20T00:00:00Z", false),
      new Especie(7, "Acacia koa", "Koa", 3, "Madeira valiosa do Havaí", "Árvore endêmica", "Florestas húmidas", "Havaí", "LC", [], "2025-06-20T00:00:00Z", "2025-06-20T00:00:00Z", false),

      // Espécies do gênero Poa (idGenero = 4)
      new Especie(8, "Poa annua", "Bluegrass anual", 4, "Gramínea anual comum", "Planta baixa, floresce rapidamente", "Gramados, jardins", "Cosmopolita", "LC", [], "2025-06-20T00:00:00Z", "2025-06-20T00:00:00Z", false),
      new Especie(9, "Poa trivialis", "Bluegrass rústico", 4, "Gramínea perene de clima temperado", "Haste alta, folhas largas", "Regiões temperadas", "Hemisférios norte e sul", "LC", [], "2025-06-20T00:00:00Z", "2025-06-20T00:00:00Z", false),

      // Espécie do gênero Bromus (idGenero = 5)
      new Especie(10, "Bromus hordeaceus", "Aveia-brava", 5, "Gramínea anual", "Inflorescência tipo panícula", "Campos e trilhas", "Eurásia, naturalizada", "LC", [], "2025-06-20T00:00:00Z", "2025-06-20T00:00:00Z", false),

      // Espécie do gênero Bellis (idGenero = 7)
      new Especie(11, "Bellis perennis", "Margarida-comum", 7, "Flor de gramado perene", "Pequena planta perene com flores brancas e amarelas", "Campos e jardins", "Europa, naturalizada", "LC", [], "2025-06-20T00:00:00Z", "2025-06-20T00:00:00Z", false)
    );

  }

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
