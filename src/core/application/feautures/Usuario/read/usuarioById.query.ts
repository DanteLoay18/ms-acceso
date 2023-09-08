import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UsuarioUseCases } from "src/core/application/services/usuario.useCases";
import { Usuario } from "src/core/domain/entity/collections/usuario.collection";

export class UsuarioByIdQuery {
    
    constructor(public readonly id:string) { }
    
}


@QueryHandler(UsuarioByIdQuery)
export class UsuarioByIdQueryHandler implements IQueryHandler<UsuarioByIdQuery>{

    constructor(private usuarioUseCases: UsuarioUseCases) { }

    execute(query: UsuarioByIdQuery): Promise<Usuario | {error:number, message:string}> {
        
        return this.usuarioUseCases.getUsuarioById(query.id);
    }

}
