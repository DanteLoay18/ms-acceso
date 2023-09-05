import { UpdateOpcionDto, UpdateSistemaDto } from "src/core/shared/dtos";
import { UsuarioDto } from "src/core/shared/dtos/usuario.dto";


export class UpdateSistemaCommand {
    
    constructor(
                public readonly id:string,
                public readonly updateSistemaDto:UpdateSistemaDto,
                public readonly usuarioDto:UsuarioDto
                ) { }
    
}