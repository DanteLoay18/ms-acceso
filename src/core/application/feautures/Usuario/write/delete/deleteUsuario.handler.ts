import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsuarioUseCases } from "src/core/application/services/usuario.useCases";
import { DeleteUsuarioCommand } from "./deleteUsuario.command";

@CommandHandler(DeleteUsuarioCommand)
export class DeleteUsuarioHandler implements ICommandHandler<DeleteUsuarioCommand> {

    constructor(private usuarioUseCases: UsuarioUseCases) { }

    async execute(command: DeleteUsuarioCommand) {
        
        return this.usuarioUseCases.deleteUsuario(command.id)
    }

}