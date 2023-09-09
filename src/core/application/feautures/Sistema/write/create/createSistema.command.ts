import { CreateSistemaDto, UsuarioDto } from "src/core/shared/dtos";

export class CreateSistemaCommand {
    
    constructor(
                public readonly createSistemaDto: CreateSistemaDto,
                public readonly usuarioDto:string
                ) { }
    
}