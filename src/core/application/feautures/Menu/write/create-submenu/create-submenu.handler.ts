import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { MenuUseCases } from "src/core/application/services";
import { CreateSubmenuCommand } from "./create-submenu.command";


@CommandHandler(CreateSubmenuCommand)
export class CreateSubmenuHandler implements ICommandHandler<CreateSubmenuCommand> {

    constructor(private menuUseCases: MenuUseCases) { }

    async execute(command: CreateSubmenuCommand) {
        
        return this.menuUseCases.createSubmenu(command.createSubmenuDto, command.usuarioDto)
    }

    
}