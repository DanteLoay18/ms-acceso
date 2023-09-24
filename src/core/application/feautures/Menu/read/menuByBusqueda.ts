import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { MenuUseCases } from "src/core/application/services";
import { Paginated } from "src/core/application/utils/Paginated";
import { Menu } from "src/core/domain/entity/collections";
import { MenuBusquedaDto } from "src/core/shared/dtos/menu/menu-busqueda.dto";

export class MenuByBusquedaQuery {
    
    constructor(public readonly menuByBusqueda:MenuBusquedaDto) { }
    
}


@QueryHandler(MenuByBusquedaQuery)
export class MenuByBusquedaQueryHandler implements IQueryHandler<MenuByBusquedaQuery>{

    constructor(private menuUseCases: MenuUseCases) { }

    execute(query: MenuByBusquedaQuery): Promise<Paginated<Menu> | {error:number, message:string}> {
        
        return this.menuUseCases.getOpcionByBusqueda(query.menuByBusqueda);
    }

}
