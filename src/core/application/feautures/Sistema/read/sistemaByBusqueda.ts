import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { SistemaUseCases } from "src/core/application/services";
import { Paginated } from "src/core/application/utils/Paginated";
import { Sistema } from "src/core/domain/entity/collections";
import { SistemaBusquedaDto } from "src/core/shared/dtos";

export class SistemaByBusquedaQuery {
    
    constructor(public readonly sistemaByBusqueda:SistemaBusquedaDto) { }
    
}


@QueryHandler(SistemaByBusquedaQuery)
export class SistemaByBusquedaQueryHandler implements IQueryHandler<SistemaByBusquedaQuery>{

    constructor(private sistemaUseCases: SistemaUseCases) { }

    execute(query: SistemaByBusquedaQuery): Promise<Paginated<Sistema> | {error:number, message:string}> {
        
        return this.sistemaUseCases.getOpcionByBusqueda(query.sistemaByBusqueda);
    }

}
