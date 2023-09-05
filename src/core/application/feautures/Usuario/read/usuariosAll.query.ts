import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UsuarioUseCases } from "src/core/application/services/usuario.useCases";
import { Usuario } from "src/core/domain/entity/collections/usuario.collection";

export class UsuariosAllQuery {
    
}


@QueryHandler(UsuariosAllQuery)
export class UsuariosAllQueryHandler implements IQueryHandler<UsuariosAllQuery>{

    constructor(private usuarioUseCases: UsuarioUseCases) { }

    execute(query: UsuariosAllQuery): Promise<Usuario[]> {
        
        return this.usuarioUseCases.getAllUsuarios();
    }

}
