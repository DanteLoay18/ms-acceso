import { RegisterUsuarioDto } from "src/core/shared/dtos/register-usuario.dto";

export class RegisterUsuarioCommand {
    
    constructor(public readonly registerUsuarioDto: RegisterUsuarioDto) { }
    
}