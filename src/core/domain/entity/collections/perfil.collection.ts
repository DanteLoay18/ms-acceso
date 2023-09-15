import { Base } from "src/core/shared/domain/base";
import { SistemasDto } from "../sistemas.dto";
import { MenusDto } from "../menus.dto";
import { Sistema } from "./sistema.collection";
import { Menu } from "./menu.collection";
import {Submenus} from "../submenu.dto"
import {Opciones} from "../opciones"
import { Opcion } from "./opcion.collection";
export class Perfil extends Base{

    tipo: string;
  
    sistemas?: SistemasDto[];

    static createPerfil(tipo: string, usuarioCreacion:string){
        const perfil = new Perfil();;
        
        perfil.tipo= tipo.toUpperCase();
        perfil.esEliminado=false;
        perfil.esBloqueado=false;
        perfil.fechaCreacion= new Date();
        perfil.usuarioCreacion= usuarioCreacion;
        return perfil;
    }

    static updatePerfil(tipo: string,sistemas: SistemasDto[], usuarioModificacion:string){
      const perfil = new Perfil();
      perfil.tipo= tipo?.toUpperCase();
      perfil.sistemas=sistemas;
      perfil.fechaModificacion=new Date();
      perfil.usuarioModificacion=usuarioModificacion;
      return perfil;
  }

  static createSistemaDto(id:string,sistema:Sistema | {error:number; message:string}, menusDto:MenusDto[]){

    const sistemaDto = new SistemasDto();
    sistemaDto.id=id;
    sistemaDto.nombre=sistema?.['nombre'];
    sistemaDto.imagen=sistema?.['imagen'];
    sistemaDto.puerto=sistema?.['puerto'];
    sistemaDto.icono=sistema?.['icono'];
    sistemaDto.url=sistema?.['url'];
    sistemaDto.esEliminado=false;
    sistemaDto.menus=menusDto;
    return {...sistemaDto};
  }

  static createMenuDto(id:string,menu:Menu | {error:number; message:string}, submenusDto:Submenus[]){

    const menusDto = new MenusDto();

    menusDto.id=id;
    menusDto.nombre=menu?.['nombre'];
    menusDto.esSubmenu=menu?.['esSubmenu'];
    menusDto.icono=menu?.['icono'];
    menusDto.url=menu?.['url'];
    menusDto.esEliminado=false;
    menusDto.submenus=submenusDto;
    return {...menusDto};
  }

  static createSubmenuDto(id:string,submenu:Menu | {error:number; message:string}, opcionesDto:Opciones[]){

    const submenusDto = new Submenus();

    submenusDto.id=id;
    submenusDto.nombre=submenu?.['nombre'];
    submenusDto.esSubmenu=submenu?.['esSubmenu'];
    submenusDto.esEliminado=false;
    submenusDto.opciones=opcionesDto;
    return {...submenusDto};
  }

  static createOpcionDto(id:string,opcion:Opcion | {error:number; message:string}){

    const opcionesDto = new Opciones();

    opcionesDto.id=id;
    opcionesDto.nombre=opcion?.['nombre'];
    opcionesDto.icono=opcion?.['icono'];
    opcionesDto.tieneOpciones=opcion?.['tieneOpciones'];
    opcionesDto.esEmergente=opcion?.['esEmergente'];
    opcionesDto.esEliminado=false;
    return {...opcionesDto};
  }

  static deletePerfil(usuarioModificacion:string){
    const perfil = new Perfil();
    perfil.esEliminado=true;
    perfil.fechaModificacion=new Date();
    perfil.usuarioModificacion=usuarioModificacion;
    return perfil;
}
}
