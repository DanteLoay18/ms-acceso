import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdatePerfilCommand } from "./updatePerfil.command";
import { PerfilUseCases } from "src/core/application/services/perfil.useCases";

@CommandHandler(UpdatePerfilCommand)
export class UpdatePerfilHandler implements ICommandHandler<UpdatePerfilCommand> {

    constructor(private perfilUseCases: PerfilUseCases) { }

    async execute(command: UpdatePerfilCommand) {
        
        return this.perfilUseCases.updatePerfil(command.id, command.updatePerfilDto, command.usuarioDto)
    }

}