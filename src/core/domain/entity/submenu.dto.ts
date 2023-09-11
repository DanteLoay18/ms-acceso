import { Opciones } from "./opciones";

export class Submenus{
    id:string;
    
    nombre: string;

    esSubmenu:boolean;

    esEliminado:boolean; //Este es eliminado es para indicar si lo borraron desde el perfil

    opciones:Opciones[]
}