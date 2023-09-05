import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateUsuarioCommand } from "./updateUsuario.command";
import { UsuarioUseCases } from "src/core/application/services/usuario.useCases";

@CommandHandler(UpdateUsuarioCommand)
export class UpdateUsuarioHandler implements ICommandHandler<UpdateUsuarioCommand> {

    constructor(private usuarioUseCases: UsuarioUseCases) { }

    async execute(command: UpdateUsuarioCommand) {
        
        return this.usuarioUseCases.updateUsuario(command.id, command.updateUsuarioDto, command.usuarioDto)
    }

}