
import { Controller} from '@nestjs/common';
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateMenuRequest, UpdateMenuRequest } from "../model";
import { MenuByIdQuery, MenusAllQuery } from "src/core/application/feautures/Menu/read";
import { CreateMenuCommand, DeleteMenuCommand, UpdateMenuCommand } from "src/core/application/feautures/Menu/write";
import { MessagePattern } from '@nestjs/microservices';


@Controller('/menu')
export class MenuController{

    constructor(
        private command: CommandBus,
        private query: QueryBus
    ) {}
    
    @MessagePattern({cmd: 'findAll_menus'})
    async findAllMenus() {
        return await this.query.execute(new MenusAllQuery());
        
    }
    
    @MessagePattern({cmd: 'findOne_menu'})
    async findMenuById(id:string) {
        return await this.query.execute(new MenuByIdQuery(id));
        
    }

    @MessagePattern({cmd: 'create_menu'})
    async createMenu({usuario,...createMenuRequest}:CreateMenuRequest) {
        return await this.command.execute(new CreateMenuCommand(createMenuRequest, usuario));
        
    }


    @MessagePattern({cmd: 'update_menu'})
    async updateMenu({id,usuario,...updateMenuRequest}:UpdateMenuRequest) {
        return await this.command.execute(new UpdateMenuCommand(id,updateMenuRequest, usuario));
        
    }

    @MessagePattern({cmd: 'delete_menu'})
    async deleteMenu({id,usuario}:any) {
        return await this.command.execute(new DeleteMenuCommand(id,usuario));
        
    }
   
}