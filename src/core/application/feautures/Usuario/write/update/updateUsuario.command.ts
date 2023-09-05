
import { UpdateUsuarioDto } from "src/core/shared/dtos";
import { UsuarioDto } from "src/core/shared/dtos/usuario.dto";


export class UpdateUsuarioCommand {
    
    constructor(
                public readonly id:string,
                public readonly updateUsuarioDto:UpdateUsuarioDto,
                public readonly usuarioDto:UsuarioDto
                ) { }
    
}