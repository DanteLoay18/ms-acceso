import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreatePerfilCommand } from "./createPerfil.command";
import { PerfilUseCases } from "src/core/application/services/perfil.useCases";


@CommandHandler(CreatePerfilCommand)
export class CreatePerfilHandler implements ICommandHandler<CreatePerfilCommand> {

    constructor(private perfilUseCases: PerfilUseCases) { }

    async execute(command: CreatePerfilCommand) {
        
        return this.perfilUseCases.createPerfil(command.createPerfilDto, command.usuarioDto)
    }

    
}