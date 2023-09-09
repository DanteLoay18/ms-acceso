import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { OpcionUseCases } from "src/core/application/services/opcionUseCases";
import { Opcion } from "src/core/domain/entity/collections/opcion.collection";

export class OpcionByIdQuery {
    
    constructor(public readonly id:string) { }
    
}


@QueryHandler(OpcionByIdQuery)
export class OpcionByIdQueryHandler implements IQueryHandler<OpcionByIdQuery>{

    constructor(private opcionUseCases: OpcionUseCases) { }

    execute(query: OpcionByIdQuery): Promise<Opcion | {error:number, message:string}> {
        
        return this.opcionUseCases.getOpcionById(query.id);
    }

}
