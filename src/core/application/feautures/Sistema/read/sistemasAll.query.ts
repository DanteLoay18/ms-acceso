import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { SistemaUseCases } from "src/core/application/services/sistema.useCases";
import { Paginated } from "src/core/application/utils/Paginated";
import { Sistema } from "src/core/domain/entity/collections";


export class SistemasAllQuery {
    constructor(public readonly page: number, public readonly  pageSize: number){}
}


@QueryHandler(SistemasAllQuery)
export class SistemasAllQueryHandler implements IQueryHandler<SistemasAllQuery>{

    constructor(private sistemaUseCases: SistemaUseCases) { }

    execute(query: SistemasAllQuery): Promise<Paginated<Sistema>> {
        
        return this.sistemaUseCases.getAllSistemas(query);
    }

}
