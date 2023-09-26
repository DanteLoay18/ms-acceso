import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { MenuUseCases } from "src/core/application/services";
import { DeleteMenuSistemaCommand } from "./deleteMenuSistema.command";

@CommandHandler(DeleteMenuSistemaCommand)
export class DeleteMenuSistemaHandler implements ICommandHandler<DeleteMenuSistemaCommand> {

    constructor(private menuUseCases: MenuUseCases) { }

    async execute(command: DeleteMenuSistemaCommand) {
        
        return this.menuUseCases.deleteMenuSistema(command.id,command.idSistema,command.usuario)
    }

}