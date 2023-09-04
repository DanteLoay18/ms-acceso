import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";


import { AuthUseCases } from "src/core/application/services/auth.useCases";
import { LoginUsuarioCommand } from "./loginUsuario.command";

@CommandHandler(LoginUsuarioCommand)
export class LoginUsuarioHandler implements ICommandHandler<LoginUsuarioCommand> {

    constructor(private authUseCases: AuthUseCases) { }

    async execute(command: LoginUsuarioCommand) {
        
        return await this.authUseCases.loginUsuario(command.loginUsuarioDto)
    }

}