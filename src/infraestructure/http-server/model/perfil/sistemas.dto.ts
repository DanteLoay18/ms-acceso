

export interface Sistemas{
    id:string;
    esEliminado:boolean;
    menus: Menus[];
}

export interface Menus{
    id:string;
    
    esEliminado:boolean; //Este es eliminado es para indicar si lo borraron desde el perfil

    submenus:Submenus[]
}

export interface Submenus{
    id:string;

    esEliminado:boolean; //Este es eliminado es para indicar si lo borraron desde el perfil

    opciones:Opciones[]
}

export interface Opciones{
    id:string;

    esEliminado:boolean; //Este es eliminado es para indicar si lo borraron desde el perfil
}