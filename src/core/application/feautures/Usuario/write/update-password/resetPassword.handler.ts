import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsuarioUseCases } from "src/core/application/services/usuario.useCases";
import { ResetPasswordUsuarioCommand } from "./resetPassword.command";

@CommandHandler(ResetPasswordUsuarioCommand)
export class ResetPasswordUsuarioHandler implements ICommandHandler<ResetPasswordUsuarioCommand> {

    constructor(private usuarioUseCases: UsuarioUseCases) { }

    async execute(command: ResetPasswordUsuarioCommand) {
        
        return this.usuarioUseCases.resetUsuarioPassword(command.id, command.usuarioDto)
    }

}