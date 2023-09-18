import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { OpcionUseCases } from "src/core/application/services/opcionUseCases";
import { Paginated } from "src/core/application/utils/Paginated";
import { Opcion } from "src/core/domain/entity/collections/opcion.collection";


export class OpcionesAllQuery {
    constructor(public readonly page: number, public readonly  pageSize: number){}
}


@QueryHandler(OpcionesAllQuery)
export class OpcionesAllQueryHandler implements IQueryHandler<OpcionesAllQuery>{

    constructor(private opcionUseCases: OpcionUseCases) { }

    execute(query: OpcionesAllQuery): Promise<Paginated<Opcion>> {
        
        return this.opcionUseCases.getAllOpciones(query);
    }

}
