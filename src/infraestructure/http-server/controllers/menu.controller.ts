
import { Controller} from '@nestjs/common';
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateMenuRequest, UpdateMenuRequest } from "../model";
import { MenuByBusquedaQuery, MenuByIdQuery, MenusAllQuery, SubmenusByMenu } from "src/core/application/feautures/Menu/read";
import { CreateMenuCommand, CreateSubmenuCommand, DeleteMenuCommand, UpdateMenuCommand } from "src/core/application/feautures/Menu/write";
import { MessagePattern } from '@nestjs/microservices';
import { MenuPaginado } from '../model/menu/menu-paginado.request';
import { BuscarMenusRequest } from '../model/menu/buscar-menu.request';
import { DeleteMenuSistemaCommand } from 'src/core/application/feautures/Menu/write/deleteMenuSistema/deleteMenuSistema.command';
import { CreateSubmenuRequest } from '../model/menu/create-submenu.request';
import { DeleteSubmenuOpcionCommand } from 'src/core/application/feautures/Menu/write/deleteSubmenuOpcion/delete-submenu-opcion.command';


@Controller()
export class MenuController{

    constructor(
        private command: CommandBus,
        private query: QueryBus
    ) {}
    
    @MessagePattern({cmd: 'findAll_menus'})
    async findAllMenus(menuPaginado:MenuPaginado) {
        return await this.query.execute(new MenusAllQuery(menuPaginado.page, menuPaginado.pageSize, menuPaginado.esSubmenu));
        
    }
    
    @MessagePattern({cmd: 'findOne_menu'})
    async findMenuById(id:string) {
        return await this.query.execute(new MenuByIdQuery(id));
        
    }

    @MessagePattern({cmd: 'findByBusqueda_menu'})
    async findMenuByBusqueda(buscarMenuRequest:BuscarMenusRequest) {
        return await this.query.execute(new MenuByBusquedaQuery(buscarMenuRequest));

        
    }

    @MessagePattern({cmd: 'create_menu'})
    async createMenu({usuario,...createMenuRequest}:CreateMenuRequest) {
        return await this.command.execute(new CreateMenuCommand(createMenuRequest, usuario));
        
    }

    @MessagePattern({cmd: 'create_submenu'})
    async createSubmenu({usuario,...createSubmenuRequest}:CreateSubmenuRequest) {
        return await this.command.execute(new CreateSubmenuCommand(createSubmenuRequest, usuario));
        
    }

    @MessagePattern({cmd: 'update_menu'})
    async updateMenu({id,usuario,...updateMenuRequest}:UpdateMenuRequest) {
        return await this.command.execute(new UpdateMenuCommand(id,updateMenuRequest, usuario));
        
    }

    @MessagePattern({cmd: 'delete_menu'})
    async deleteMenu({id,usuario}:any) {
        return await this.command.execute(new DeleteMenuCommand(id,usuario));
        
    }
    
    @MessagePattern({cmd: 'delete_menusistema'})
    async deleteMenuSistema({id,idSistema,usuario}:any) {
        return await this.command.execute(new DeleteMenuSistemaCommand(id,idSistema,usuario));
        
    }

    @MessagePattern({cmd: 'find_submenus_by_menu'})
    async findSubmenusByMeny({id, page, pageSize, esSubmenu}) {
        return await this.query.execute(new SubmenusByMenu(id,page, pageSize, esSubmenu));
    }

    
    @MessagePattern({cmd: 'delete_submenuopcion'})
    async deleteSubmenuOpcion({id,idOpcion,usuario}:any) {
        return await this.command.execute(new DeleteSubmenuOpcionCommand(id,idOpcion,usuario));
        
    }
}