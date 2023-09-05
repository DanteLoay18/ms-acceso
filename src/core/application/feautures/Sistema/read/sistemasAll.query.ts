import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { OpcionUseCases } from "src/core/application/services/opcionUseCases";
import { SistemaUseCases } from "src/core/application/services/sistema.useCases";
import { Sistema } from "src/core/domain/entity/collections";
import { Opcion } from "src/core/domain/entity/collections/opcion.collection";


export class SistemasAllQuery {
    
}


@QueryHandler(SistemasAllQuery)
export class SistemasAllQueryHandler implements IQueryHandler<SistemasAllQuery>{

    constructor(private sistemaUseCases: SistemaUseCases) { }

    execute(query: SistemasAllQuery): Promise<Sistema[]> {
        
        return this.sistemaUseCases.getAllSistemas();
    }

}
