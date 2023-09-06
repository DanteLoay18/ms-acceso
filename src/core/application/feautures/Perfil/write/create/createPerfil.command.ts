import { CreatePerfilDto, UsuarioDto } from "src/core/shared/dtos";

export class CreatePerfilCommand {
    
    constructor(
                public readonly createPerfilDto: CreatePerfilDto,
                public readonly usuarioDto:UsuarioDto
                ) { }
    
}