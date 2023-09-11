import { Submenus } from "./submenu.dto";

export class MenusDto{
    id:string;

    nombre: string;

    esSubmenu:boolean;
    
    esEliminado:boolean; //Este es eliminado es para indicar si lo borraron desde el perfil

    submenus:Submenus[]
}