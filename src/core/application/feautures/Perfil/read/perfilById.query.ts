import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PerfilUseCases } from "src/core/application/services/perfil.useCases";
import { Perfil } from "src/core/domain/entity/collections";

export class PerfilByIdQuery {
    
    constructor(public readonly id:string) { }
    
}


@QueryHandler(PerfilByIdQuery)
export class PerfilByIdQueryHandler implements IQueryHandler<PerfilByIdQuery>{

    constructor(private perfilUseCases: PerfilUseCases) { }

    execute(query: PerfilByIdQuery): Promise<Perfil | {error:number, message:string}> {
        
        return this.perfilUseCases.getPerfilById(query.id);
    }

}
