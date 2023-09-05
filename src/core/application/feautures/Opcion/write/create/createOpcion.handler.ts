import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { AuthUseCases } from "src/core/application/services/auth.useCases";
import { CreateOpcionCommand } from "./createOpcion.command";
import { OpcionUseCases } from "src/core/application/services/opcionUseCases";

@CommandHandler(CreateOpcionCommand)
export class CreateOpcionHandler implements ICommandHandler<CreateOpcionCommand> {

    constructor(private opcionUseCases: OpcionUseCases) { }

    async execute(command: CreateOpcionCommand) {
        
        return this.opcionUseCases.createOpcion(command.createOpcionDto, command.usuarioDto)
    }

    
}