import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateMenuCommand } from "./createMenu.command";
import { MenuUseCases } from "src/core/application/services";


@CommandHandler(CreateMenuCommand)
export class CreateMenuHandler implements ICommandHandler<CreateMenuCommand> {

    constructor(private menuUseCases: MenuUseCases) { }

    async execute(command: CreateMenuCommand) {
        
        return this.menuUseCases.createMenu(command.createMenuDto, command.usuarioDto)
    }

    
}