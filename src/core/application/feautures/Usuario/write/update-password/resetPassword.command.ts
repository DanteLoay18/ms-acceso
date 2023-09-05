import { UpdateUsuarioDto } from "src/core/shared/dtos/update-usuario.dto";
import { UsuarioDto } from "src/core/shared/dtos/usuario.dto";


export class ResetPasswordUsuarioCommand {
    
    constructor(
                public readonly id:string,
                public readonly usuarioDto:UsuarioDto
                ) { }
    
}