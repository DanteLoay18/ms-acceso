import { UpdateOpcionDto } from "src/core/shared/dtos";
import { UsuarioDto } from "src/core/shared/dtos/usuario.dto";


export class UpdateOpcionCommand {
    
    constructor(
                public readonly id:string,
                public readonly updateOpcionDto:UpdateOpcionDto,
                public readonly usuarioDto:UsuarioDto
                ) { }
    
}