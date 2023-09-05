import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Menu } from '../../../../domain/entity/collections/menu.collection';
import { MenuUseCases } from "src/core/application/services";


export class MenusAllQuery {
    
}


@QueryHandler(MenusAllQuery)
export class MenusAllQueryHandler implements IQueryHandler<MenusAllQuery>{

    constructor(private menuUseCases: MenuUseCases) { }

    execute(query: MenusAllQuery): Promise<Menu[]> {
        
        return this.menuUseCases.getAllMenus();
    }

}
