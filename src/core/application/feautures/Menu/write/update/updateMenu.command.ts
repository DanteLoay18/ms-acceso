import { UpdateMenuDto } from "src/core/shared/dtos";
import { UsuarioDto } from "src/core/shared/dtos/usuario.dto";


export class UpdateMenuCommand {
    
    constructor(
                public readonly id:string,
                public readonly updateMenuDto:UpdateMenuDto,
                public readonly usuarioDto:string
                ) { }
    
}