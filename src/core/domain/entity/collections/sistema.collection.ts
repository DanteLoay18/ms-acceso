import { Base } from '../../../shared/domain/base';

export class Sistema extends Base{
    
    nombre: string;
   
    url: string;

    imagen: string;

    puerto: string;

    static createSistema(nombre: string, url:string, imagen:string, puerto:string, usuarioCreacion:string){
        const sistema = new Sistema();;
        
        sistema.nombre=nombre.toUpperCase();
        sistema.url=url.toUpperCase();
        sistema.imagen=imagen;
        sistema.puerto=puerto;
        sistema.esEliminado=false;
        sistema.esBloqueado=false;
        sistema.fechaCreacion= new Date();
        sistema.usuarioCreacion= usuarioCreacion;
        return sistema;
    }

    static updateSistema(nombre: string,  url:string, imagen:string, puerto:string, usuarioModificacion:string){
      const sistema = new Sistema();
      sistema.nombre=nombre?.toUpperCase();
      sistema.url=url?.toUpperCase();
      sistema.imagen=imagen;
      sistema.puerto=puerto;
      sistema.fechaModificacion=new Date();
      sistema.usuarioModificacion=usuarioModificacion;
      return sistema;
  } 
  static deleteSistema(usuarioModificacion:string){
    const sistema = new Sistema();
    sistema.esEliminado=true;
    sistema.fechaModificacion=new Date();
    sistema.usuarioModificacion=usuarioModificacion;
    return sistema;
}
}