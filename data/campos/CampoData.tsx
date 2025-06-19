import Campo from "./Campo";
import { useProjetoData } from "../projetos/ProjetoDataContext";
import Projeto from "../projetos/Projeto";
import EntityData from "../EntityData";

class CampoData extends EntityData{
    constructor(
    ) {
        
        const projeto: Projeto = useProjetoData().getProjetoById(1).data;

        const campo1 = new Campo(
            1,
            projeto,
            "Ferraz",
            "Um campo",
            "Brasil",
            "São Paulo",
            "Ferraz de Vaconcelos",
            "rua um",
            "Ativo"
        )

        super([campo1]);
    }

    add(campo: Campo) {

    }
}

export default CampoData