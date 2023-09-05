import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateOpcionCommand } from "./updateOpcion.command";
import { OpcionUseCases } from "src/core/application/services/opcionUseCases";

@CommandHandler(UpdateOpcionCommand)
export class UpdateOpcionHandler implements ICommandHandler<UpdateOpcionCommand> {

    constructor(private opcionUseCases: OpcionUseCases) { }

    async execute(command: UpdateOpcionCommand) {
        
        return this.opcionUseCases.updateOpcion(command.id, command.updateOpcionDto, command.usuarioDto)
    }

}