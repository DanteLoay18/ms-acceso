import { CreateMenuDto, UsuarioDto } from "src/core/shared/dtos";

export class CreateMenuCommand {
    
    constructor(
                public readonly createMenuDto: CreateMenuDto,
                public readonly usuarioDto:UsuarioDto
                ) { }
    
}