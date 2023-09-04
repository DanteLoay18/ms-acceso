import { RegisterUsuarioDto } from "src/core/shared/dtos/register-usuario.dto";
import { UsuarioDto } from "src/core/shared/dtos/usuario.dto";

export class RegisterUsuarioCommand {
    
    constructor(
                public readonly registerUsuarioDto: RegisterUsuarioDto,
                public readonly usuarioDto:UsuarioDto
                ) { }
    
}