import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { MenuUseCases } from "src/core/application/services";
import { DeleteSubmenuOpcionCommand } from "./delete-submenu-opcion.command";

@CommandHandler(DeleteSubmenuOpcionCommand)
export class DeleteSubmenuOpcionHandler implements ICommandHandler<DeleteSubmenuOpcionCommand> {

    constructor(private menuUseCases: MenuUseCases) { }

    async execute(command: DeleteSubmenuOpcionCommand) {
        
        return this.menuUseCases.deleteSubmenuOpcion(command.id,command.idOpcion,command.usuario)
    }

}