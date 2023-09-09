import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { MenuUseCases } from "src/core/application/services";
import { Menu } from "src/core/domain/entity/collections";

export class MenuByIdQuery {
    
    constructor(public readonly id:string) { }
    
}


@QueryHandler(MenuByIdQuery)
export class MenuByIdQueryHandler implements IQueryHandler<MenuByIdQuery>{

    constructor(private menuUseCases: MenuUseCases) { }

    execute(query: MenuByIdQuery): Promise<Menu | {error:number, message:string}> {
        
        return this.menuUseCases.getMenuById(query.id);
    }

}
