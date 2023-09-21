import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { OpcionUseCases } from "src/core/application/services/opcionUseCases";
import { Paginated } from "src/core/application/utils/Paginated";
import { Opcion } from "src/core/domain/entity/collections/opcion.collection";
import { OpcionBusquedaDto } from "src/core/shared/dtos/opcion/opcion-busqueda.dto";

export class OpcionByBusquedaQuery {
    
    constructor(public readonly opcionByBusqueda:OpcionBusquedaDto) { }
    
}


@QueryHandler(OpcionByBusquedaQuery)
export class OpcionByBusquedaQueryHandler implements IQueryHandler<OpcionByBusquedaQuery>{

    constructor(private opcionUseCases: OpcionUseCases) { }

    execute(query: OpcionByBusquedaQuery): Promise<Paginated<Opcion> | {error:number, message:string}> {
        
        return this.opcionUseCases.getOpcionByBusqueda(query.opcionByBusqueda);
    }

}
