import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateSistemaCommand } from "./updateSistema.command";
import { SistemaUseCases } from "src/core/application/services/sistema.useCases";

@CommandHandler(UpdateSistemaCommand)
export class UpdateSistemaHandler implements ICommandHandler<UpdateSistemaCommand> {

    constructor(private sistemaUseCases: SistemaUseCases) { }

    async execute(command: UpdateSistemaCommand) {
        
        return this.sistemaUseCases.updateSistema(command.id, command.updateSistemaDto, command.usuarioDto)
    }

}