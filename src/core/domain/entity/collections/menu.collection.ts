import { Base } from "src/core/shared/domain/base";

export class Menu extends Base{
    
    
    nombre: string;

    sistema: string;

    icono:string;

    url:string;

    submenus: string[];

    opciones: string[];

    esSubmenu:boolean;

    static createMenu(nombre: string, esSubmenu:boolean, usuarioCreacion:string,icono:string, url:string){
        const menu = new Menu();;
        
        menu.nombre=nombre.toUpperCase();
        menu.esSubmenu=esSubmenu;
        menu.esEliminado=false;
        menu.esBloqueado=false;
        menu.fechaCreacion= new Date();
        menu.icono=icono.toUpperCase();
        menu.url=url.toUpperCase();
        menu.usuarioCreacion= usuarioCreacion;
        return menu;
    }

    static createSubmenu(nombre: string, sistema:string, usuarioCreacion:string){
        const menu = new Menu();;
        
        menu.nombre=nombre.toUpperCase();
        menu.esSubmenu=true;
        menu.sistema=sistema;
        menu.esEliminado=false;
        menu.esBloqueado=false;
        menu.fechaCreacion= new Date();
        menu.usuarioCreacion= usuarioCreacion;
        return menu;
    }

    static updateMenu(nombre: string, esSubmenu:boolean, sistema:string, submenus:string[], opciones:string[],icono:string, url:string, usuarioModificacion:string){
        const menu = new Menu();
        
        menu.nombre=nombre?.toUpperCase();
        menu.sistema=sistema;
        menu.submenus=submenus;
        menu.opciones=opciones;
        menu.esSubmenu=esSubmenu;
        menu.icono=icono?.toUpperCase();
        menu.url=url?.toUpperCase();
        menu.esEliminado=false;
        menu.esBloqueado=false;
        menu.fechaModificacion=new Date();
        menu.usuarioModificacion=usuarioModificacion;
        return menu;
    }

    static updateSistemaSubmenu(sistema:string,usuarioModificacion:string){
        const menu = new Menu();
        
    
        menu.sistema=sistema;
        menu.esEliminado=false;
        menu.esBloqueado=false;
        menu.fechaModificacion=new Date();
        menu.usuarioModificacion=usuarioModificacion;
        return menu;
    }

    static updateMenuSubmenus(submenus:string[], usuarioModificacion:string){
        const menu = new Menu();
        
        menu.submenus=submenus;
        menu.esEliminado=false;
        menu.esBloqueado=false;
        menu.fechaModificacion=new Date();
        menu.usuarioModificacion=usuarioModificacion;
        return menu;
    }
    static deleteMenu( usuarioModificacion:string){
        const menu = new Menu();
        menu.esEliminado=true;
        menu.fechaModificacion=new Date();
        menu.usuarioModificacion=usuarioModificacion;
        return menu;
    }

    static deleteMenuSistema( usuarioCreacion:string){
        const menu = new Menu();
        menu.sistema=null;
        menu.fechaModificacion=new Date();
        menu.usuarioModificacion=usuarioCreacion;
        return menu;
    }
}