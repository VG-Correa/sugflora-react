import Usuario from "./usuarios/Usuario";
import { useUsuarioData } from "./usuarios/UsuarioDataContext";

class Entity {

    constructor(
        public className: string,
        public id: number | undefined = undefined,
        public responsavel: Usuario = useUsuarioData().currentUser,
        public createdAt: Date = new Date(),
        public deletedAt: Date = new Date(),
        public status: "Ativo" | "Inativo" | "Concluido" | "Cancelado" = "Ativo"
    ){}
}

export default Entity;