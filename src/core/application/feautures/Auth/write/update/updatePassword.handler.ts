import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { AuthUseCases } from "src/core/application/services/auth.useCases";
import { UpdateUsuarioPasswordCommand } from "./updatePassword.command";

@CommandHandler(UpdateUsuarioPasswordCommand)
export class UpdateUsuarioPasswordHandler implements ICommandHandler<UpdateUsuarioPasswordCommand> {

    constructor(private authUseCases: AuthUseCases) { }

    async execute(command: UpdateUsuarioPasswordCommand) {
        
        return this.authUseCases.updatePassword(command.id, command.password,command.confirmationPassword, command.usuarioDto)
    }

}