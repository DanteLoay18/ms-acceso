import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { DeletePerfilCommand } from "./deletePerfil.command";
import { PerfilUseCases } from "src/core/application/services/perfil.useCases";

@CommandHandler(DeletePerfilCommand)
export class DeletePerfilHandler implements ICommandHandler<DeletePerfilCommand> {

    constructor(private perfilUseCases: PerfilUseCases) { }

    async execute(command: DeletePerfilCommand) {
        
        return this.perfilUseCases.deletePerfil(command.id)
    }

}