import {  UpdatePerfilDto } from "src/core/shared/dtos";
import { UsuarioDto } from "src/core/shared/dtos/usuario.dto";


export class UpdatePerfilCommand {
    
    constructor(
                public readonly id:string,
                public readonly updatePerfilDto:UpdatePerfilDto,
                public readonly usuarioDto:UsuarioDto
                ) { }
    
}