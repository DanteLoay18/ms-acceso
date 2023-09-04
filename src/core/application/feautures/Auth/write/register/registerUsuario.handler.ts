import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { RegisterUsuarioCommand } from "./registerUsuario.command";
import { AuthUseCases } from "src/core/application/services/auth.useCases";

@CommandHandler(RegisterUsuarioCommand)
export class RegisterUsuarioHandler implements ICommandHandler<RegisterUsuarioCommand> {

    constructor(private authUseCases: AuthUseCases) { }

    async execute(command: RegisterUsuarioCommand) {
        
        return this.authUseCases.registerUsuario(command.registerUsuarioDto)
    }

}