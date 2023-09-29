import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Menu } from '../../../../domain/entity/collections/menu.collection';
import { MenuUseCases } from "src/core/application/services";
import { Paginated } from '../../../utils/Paginated';


export class SubmenusByMenu {
    constructor(public readonly id:string, public readonly page: number, public readonly  pageSize: number, public readonly esSubmenu:boolean){}
}


@QueryHandler(SubmenusByMenu)
export class SubmenusByMenuHandler implements IQueryHandler<SubmenusByMenu>{

    constructor(private menuUseCases: MenuUseCases) { }

    execute(query: SubmenusByMenu): Promise<Paginated<string>> {
        
        return this.menuUseCases.getSubmenusByMenu(query);
    }

}