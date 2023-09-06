import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PerfilUseCases } from "src/core/application/services/perfil.useCases";
import { Perfil } from "src/core/domain/entity/collections";

export class PerfilesAllQuery {
    
}


@QueryHandler(PerfilesAllQuery)
export class PerfilesAllQueryHandler implements IQueryHandler<PerfilesAllQuery>{

    constructor(private perfilUseCases: PerfilUseCases) { }

    execute(query: PerfilesAllQuery): Promise<Perfil[]> {
        
        return this.perfilUseCases.getAllPerfiles();
    }

}
