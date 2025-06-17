import Usuario from "../usuarios/Usuario";

class Projeto {

    constructor(
        public id: number,
        public nome: string,
        public descricao: string,
        public dataInicio: Date,
        public dataFim: Date | null = null,
        public status: 'ativo' | 'concluido' | 'cancelado' = 'ativo',
        public responsavel: Usuario,
        public image
    ) {}

}

export default Projeto;