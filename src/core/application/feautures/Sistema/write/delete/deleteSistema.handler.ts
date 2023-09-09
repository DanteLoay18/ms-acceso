import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteSistemaCommand } from "./deleteSistema.command";
import { SistemaUseCases } from "src/core/application/services/sistema.useCases";

@CommandHandler(DeleteSistemaCommand)
export class DeleteSistemaHandler implements ICommandHandler<DeleteSistemaCommand> {

    constructor(private sistemaUseCases: SistemaUseCases) { }

    async execute(command: DeleteSistemaCommand) {
        
        return this.sistemaUseCases.deleteSistema(command.id, command.usuarioDto)
    }

}