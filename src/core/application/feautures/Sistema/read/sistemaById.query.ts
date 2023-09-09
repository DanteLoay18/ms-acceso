import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { SistemaUseCases } from "src/core/application/services/sistema.useCases";
import { Sistema } from "src/core/domain/entity/collections";

export class SistemaByIdQuery {
    
    constructor(public readonly id:string) { }
    
}


@QueryHandler(SistemaByIdQuery)
export class SistemaByIdQueryHandler implements IQueryHandler<SistemaByIdQuery>{

    constructor(private sistemaUseCases: SistemaUseCases) { }

    execute(query: SistemaByIdQuery): Promise<Sistema | {error:number, message:string}> {
        
        return this.sistemaUseCases.getSistemaById(query.id);
    }

}
