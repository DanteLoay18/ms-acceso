import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { AuthUseCases } from "src/core/application/services/auth.useCases";
import { CheckStatusUsuarioCommand } from "./checkStatus.command";

@CommandHandler(CheckStatusUsuarioCommand)
export class CheckStatusUsuarioHandler implements ICommandHandler<CheckStatusUsuarioCommand> {

    constructor(private authUseCases: AuthUseCases) { }

    async execute(command: CheckStatusUsuarioCommand) {

        return this.authUseCases.checkStatusAuth(command.usuarioDto);
    }

}