import { UsuarioDto } from "src/core/shared/dtos/usuario.dto";


export class UpdateUsuarioPasswordCommand {
    
    constructor(
                public readonly id:string,
                public readonly password:string,
                public readonly usuarioDto:UsuarioDto
                ) { }
    
}