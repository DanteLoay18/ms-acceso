import { Base } from "src/core/shared/domain/base";

export class Menu extends Base{
    
    nombre: string;

    sistema: string;

    submenus: string[];

    opciones: string[];

    esSubmenu:boolean;

    static createMenu(nombre: string, esSubmenu:boolean, usuarioCreacion:string){
        const menu = new Menu();;
        
        menu.nombre=nombre.toUpperCase();
        menu.esSubmenu=esSubmenu;
        menu.esEliminado=false;
        menu.esBloqueado=false;
        menu.fechaCreacion= new Date();
        menu.fechaModificacion=new Date();
        menu.usuarioCreacion= usuarioCreacion;
        menu.usuarioModificacion=usuarioCreacion;
        return menu;
    }

    static updateMenu(nombre: string, esSubmenu:boolean, sistema:string, submenus:string[], opciones:string[], usuarioCreacion:string){
        const menu = new Menu();
        
        menu.nombre=nombre?.toUpperCase();
        menu.sistema=sistema;
        menu.submenus=submenus;
        menu.opciones=opciones;
        menu.esSubmenu=esSubmenu;
        menu.esEliminado=false;
        menu.esBloqueado=false;
        menu.fechaModificacion=new Date();
        menu.usuarioModificacion=usuarioCreacion;
        return menu;
    }

}