import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { MenuUseCases } from "src/core/application/services";
import { UpdateMenuCommand } from "./updateMenu.command";

@CommandHandler(UpdateMenuCommand)
export class UpdateMenuHandler implements ICommandHandler<UpdateMenuCommand> {

    constructor(private menuUseCases: MenuUseCases) { }

    async execute(command: UpdateMenuCommand) {
        
        return this.menuUseCases.updateMenu(command.id, command.updateMenuDto, command.usuarioDto)
    }

}