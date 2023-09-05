import { Menu } from "../../entity/collections";

export interface MenuRepository{

    createMenu(menu: Menu): Promise<Menu>;
    findOneById(id:string):Promise<Menu>;
    findAll():Promise<Menu[]>;
    findByNombre(nombre:string):Promise<Menu>;
    updateMenu(id:string,menu:Menu): Promise<Menu>;
    deleteMenu(id:string): Promise<Menu>;
    actualizarBloqueo(id:string,esBloqueado:boolean):Promise<Menu>;
}