import Message from "../../Messages/Message";
import Usuario from "../usuarios/Usuario";
import UsuarioData from "../usuarios/UsuarioData";
import { useUsuarioData } from "../usuarios/UsuarioDataContext";
import Projeto from "./Projeto";

class ProjetoData {

    constructor(
        public projetos: Projeto[] = []
    ) {

        const usuarioADM: Usuario = useUsuarioData().getUsuarioById(1).data;

        const projeto1 = new Projeto(
            1,
            'Projeto Alpha',
            'Descrição do Projeto Alpha',
            new Date('2023-01-01'),
            null,
            'ativo',
            usuarioADM, // Responsável pode ser definido posteriormente
            undefined
        );

        const projeto2 = new Projeto(
            2,
            'Projeto Beta',
            'Descrição do Projeto Beta',
            new Date('2023-02-01'),
            null,
            'ativo',
            usuarioADM, // Responsável pode ser definido posteriormente
            undefined
        );

        this.add(projeto1);
        this.add(projeto2);

        console.log('Todos os projetos: ', this.getAll());

    }

    getById(id: number): Message<Projeto> | undefined {
        const projeto = this.projetos.find(projeto => projeto.id === id);
        
        if (projeto !== undefined) {
            return new Message(200, 'Projeto localizado', projeto);
        } else {
            return new Message(404, 'Projeto não localizado');        
        }
    }

    getAll(): Message<Projeto[]> {
        return new Message(200,undefined, this.projetos);
    }

    exists(projeto: Projeto): boolean {
        const projetoExistente = this.projetos.find(p => p.id === projeto.id || p.nome === projeto.nome);
        return projetoExistente !== undefined;
    }

    getLastId(): number {
        if (this.projetos.length === 0) {
            return 0; // Retorna 0 se não houver projetos
        }
        const lastProjeto = this.projetos[this.projetos.length - 1];
        return lastProjeto.id, 10; // Retorna o ID do último projeto
        
    }

    add(projeto: Projeto): Message<Projeto> {

        // Verifica se o projeto já existe pelo ID
        const projetoExistente = this.projetos.find(p => p.id === projeto.id);
        if (this.exists(projeto)) {
            console.error(`Projeto com ID ${projeto.id} já existe.`);
            
            return new Message(409, "Projeto já existe", projetoExistente); // Retorna o projeto existente
        }

        // Se o ID não for fornecido, gera um novo ID
        if (!projeto.id) {
            projeto.id = (this.getLastId() + 1); // Gera um novo ID sequencial
        }

        // Verifica se o nome do projeto já existe
        const nomeExistente = this.projetos.find(p => p.nome === projeto.nome);
        if (nomeExistente) {
            console.error(`Já existe um projeto com o nome ${projeto.nome}.`);
            return new Message(409, "Já existe um projeto com esse nome", nomeExistente); // Retorna o projeto existente
        }

        // Adiciona o novo projeto
        this.projetos.push(projeto);
        console.log(`Projeto ${projeto.nome} adicionado com sucesso.`);
        // Retorna o projeto adicionado

        return new Message(201, 'Projeto adicionado com sucesso', projeto); // Retorna o projeto adicionado
    }

    delete(projeto: Projeto): Message<boolean> {
        const projetoExistente = this.getById(projeto.id);
        if (projetoExistente) {
            this.projetos = this.projetos.filter(p => p.id !== projeto.id);
            console.log(`Projeto ${projeto.nome} removido com sucesso.`);
            return new Message(200, 'Projeto removido com sucesso', true);
        }
        console.error(`Projeto com ID ${projeto.id} não encontrado.`);
        return new Message(404, 'Projeto não encontrado', false);
    }

    update(projeto: Projeto): Message<Projeto> {
        const index = this.projetos.findIndex(p => p.id === projeto.id);
        if (index !== -1) {
            this.projetos[index] = projeto; // Atualiza o projeto existente
            console.log(`Projeto ${projeto.nome} atualizado com sucesso.`);
            return new Message(200, 'Projeto atualizado com sucesso', projeto);
        } else {
            console.error(`Projeto com ID ${projeto.id} não encontrado para atualização.`);
            return new Message(404, 'Projeto não encontrado para atualização');
        }
    }

    getByUsuario(usuario: Usuario): Message<Projeto[]> {
        const projetosDoUsuario = this.projetos.filter(p => p.responsavel.id === usuario.id);
        
        if (projetosDoUsuario.length > 0) {
            return new Message(200, 'Projetos encontrados para o usuário', projetosDoUsuario);
        } else {
            return new Message(404, 'Nenhum projeto encontrado para o usuário');
        }
    }
}

export default ProjetoData;