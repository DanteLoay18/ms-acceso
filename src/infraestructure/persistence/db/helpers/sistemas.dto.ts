export class SistemasDto{
    id:string;

    nombre: string;
   
    url: string;

    imagen: string;

    puerto: string;
    
    icono:string;
    
    esEliminado:boolean; //Este es eliminado es para indicar si lo borraron desde el perfil

    menus: MenusDto[];

}
export interface MenusDto{
    id:string;

    nombre: string;

    esSubmenu:boolean;
    
    esEliminado:boolean; //Este es eliminado es para indicar si lo borraron desde el perfil

    submenus:Submenus[]
}


export interface Submenus{
    id:string;
    
    nombre: string;

    esSubmenu:boolean;

    esEliminado:boolean; //Este es eliminado es para indicar si lo borraron desde el perfil

    opciones:Opciones[]
}

export interface Opciones{
    id:string;
    
    nombre: string;

    icono:string;
    
    tieneOpciones:boolean;
 
    esEmergente:boolean;

    esEliminado:boolean; //Este es eliminado es para indicar si lo borraron desde el perfil
}