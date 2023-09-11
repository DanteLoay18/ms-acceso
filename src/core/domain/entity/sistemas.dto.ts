import { MenusDto } from "./menus.dto";

export class SistemasDto{
    id?:string;

    nombre: string;
   
    url: string;

    imagen: string;

    puerto: string;

    icono:string;
    
    esEliminado?:boolean; //Este es eliminado es para indicar si lo borraron desde el perfil

    menus?: MenusDto[];

}