import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { OpcionUseCases } from "src/core/application/services/opcionUseCases";
import { Opcion } from "src/core/domain/entity/collections/opcion.collection";


export class OpcionesAllQuery {
    
}


@QueryHandler(OpcionesAllQuery)
export class OpcionesAllQueryHandler implements IQueryHandler<OpcionesAllQuery>{

    constructor(private opcionUseCases: OpcionUseCases) { }

    execute(query: OpcionesAllQuery): Promise<Opcion[]> {
        
        return this.opcionUseCases.getAllOpciones();
    }

}
