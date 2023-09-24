import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Menu } from '../../../../domain/entity/collections/menu.collection';
import { MenuUseCases } from "src/core/application/services";
import { Paginated } from '../../../utils/Paginated';


export class MenusAllQuery {
    constructor(public readonly page: number, public readonly  pageSize: number, public readonly esSubmenu:boolean){}
}


@QueryHandler(MenusAllQuery)
export class MenusAllQueryHandler implements IQueryHandler<MenusAllQuery>{

    constructor(private menuUseCases: MenuUseCases) { }

    execute(query: MenusAllQuery): Promise<Paginated<Menu>> {
        
        return this.menuUseCases.getAllMenus(query);
    }

}
