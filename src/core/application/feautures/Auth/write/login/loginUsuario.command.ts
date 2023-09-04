import { LoginUsuarioDto } from "src/core/shared/dtos";

export class LoginUsuarioCommand {
    
    constructor(public readonly loginUsuarioDto: LoginUsuarioDto) { }
    
}