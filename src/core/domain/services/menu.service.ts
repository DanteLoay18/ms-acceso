
import { Menu } from "../entity/collections";
import { MenuRepository } from "../ports/outbound";


export class MenuService{
    
    constructor(private readonly menuRepository:MenuRepository){}

    findAll(){
       return this.menuRepository.findAll();
    }

    findOneById(id:string){
        return this.menuRepository.findOneById(id);
    }
    
    findOneByNombre(nombre:string){
        return this.menuRepository.findByNombre(nombre);
    }

    getMenusSlice(limit: number, offset: number, esSubmenu:boolean) {
        return this.menuRepository.findBySlice(limit, offset,esSubmenu)
    }

    getMenusCount(esSubmenu:boolean) {
        return this.menuRepository.count(esSubmenu)
    }

    getMenusByBusquedaSlice(nombre:string, icono:string, url:string,esSubmenu:boolean,limit: number, offset: number) {
        return this.menuRepository.findByBusquedaSlice(nombre, icono, url,esSubmenu,limit, offset)
    }

    getMenusByBusquedaCount(nombre:string, icono:string,  url:string,esSubmenu:boolean, limit:number) {
        return this.menuRepository.findByBusquedaSlice(nombre, icono, url,esSubmenu,limit, 0)
    }

    getSubmenusByMenuSlice(id:string, esSubmenu:boolean): any{
        return this.menuRepository.findSubmenusByMenuSlice(id,esSubmenu)
    }

    createMenu(menu:Menu){
        return this.menuRepository.createMenu(menu);
    }

    updateMenu(id:string,menu:Menu){
        return this.menuRepository.updateMenu(id,menu);
    }

    deleteMenu(id:string, menu:Menu){
        return this.menuRepository.deleteMenu(id,menu);
    }

    bloquearMenu(id:string, esBloqueado:boolean){
        return this.menuRepository.actualizarBloqueo(id, esBloqueado);
    }

}