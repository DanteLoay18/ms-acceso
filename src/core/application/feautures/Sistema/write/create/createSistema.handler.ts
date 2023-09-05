import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { OpcionUseCases } from "src/core/application/services/opcionUseCases";
import { CreateSistemaCommand } from "./createSistema.command";
import { SistemaUseCases } from "src/core/application/services/sistema.useCases";

@CommandHandler(CreateSistemaCommand)
export class CreateSistemaHandler implements ICommandHandler<CreateSistemaCommand> {

    constructor(private sistemaUseCases: SistemaUseCases) { }

    async execute(command: CreateSistemaCommand) {
        
        return this.sistemaUseCases.createSistema(command.createSistemaDto, command.usuarioDto)
    }

    
}