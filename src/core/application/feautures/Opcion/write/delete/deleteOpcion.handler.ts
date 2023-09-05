import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteOpcionCommand } from "./deleteOpcion.command";
import { OpcionUseCases } from "src/core/application/services/opcionUseCases";

@CommandHandler(DeleteOpcionCommand)
export class DeleteOpcionHandler implements ICommandHandler<DeleteOpcionCommand> {

    constructor(private opcionUseCases: OpcionUseCases) { }

    async execute(command: DeleteOpcionCommand) {
        
        return this.opcionUseCases.deleteOpcion(command.id)
    }

}