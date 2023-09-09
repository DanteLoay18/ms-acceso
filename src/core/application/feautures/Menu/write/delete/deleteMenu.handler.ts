import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { MenuUseCases } from "src/core/application/services";
import { DeleteMenuCommand } from "./deleteMenu.command";

@CommandHandler(DeleteMenuCommand)
export class DeleteMenuHandler implements ICommandHandler<DeleteMenuCommand> {

    constructor(private menuUseCases: MenuUseCases) { }

    async execute(command: DeleteMenuCommand) {
        
        return this.menuUseCases.deleteMenu(command.id,command.usuario)
    }

}