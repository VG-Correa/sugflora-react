import Entity from "../Entity";
import Projeto from "../projetos/Projeto";

class Campo extends Entity{
    
    constructor(
        projeto: Projeto,
        nome: string,
        descricao: string | undefined,
        pais: string,
        estado: string,
        cidade: string,
        endereco: string,
        status: "Ativo" | "Inativo" | "Concluído" | "Cancelado" = "Ativo",
    ) {
        super("Campo");
    }
}

export default Campo;