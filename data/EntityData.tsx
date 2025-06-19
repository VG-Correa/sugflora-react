import Message from "../Messages/Message";
import Entity from "./Entity";


class EntityData<Data> {

    constructor(
        public entities: Entity[] = []
    ){}

    getLastId(): number {
        if (this.entities.length === 0) {
            return 0; // Retorna 0 se não houver data
        }
        const lastEntity = this.entities[this.entities.length - 1];
        return lastEntity.id, 10;
    }

    getById(id: number): Message<Data> {
        const entity = this.entities.find(entity => entity.id === id) as Entity
        return new Message(200, entity.className)

    }

    add(entity: Data): Message<Data> {
        const entitye = entity as Entity;
        const lastId = this.getLastId();

        return new Message(201, entitye.className  + "");

    }

}


export default EntityData;