import { Menu } from "../../entity/collections";

export interface MenuRepository{

    createMenu(menu: Menu): Promise<Menu>;
    findOneById(id:string):Promise<Menu>;
    findAll():Promise<Menu[]>;
    findByNombre(nombre:string):Promise<Menu>;
    findBySlice(limit: number, offset: number, esSubmenu:boolean): Promise<Menu[]>
    findByBusquedaSlice(nombre:string, icono:string, url:string,esSubmenu:boolean, limit: number, offset: number):Promise<Menu[]>
    findSubmenusByMenuSlice(id:string, esSubmenu:boolean): Promise<Menu>
    count(esSubmenu:boolean): Promise<number>
    updateMenu(id:string,menu:Menu): Promise<Menu>;
    deleteMenu(id:string, menu:Menu): Promise<Menu>;
    actualizarBloqueo(id:string,esBloqueado:boolean):Promise<Menu>;
}