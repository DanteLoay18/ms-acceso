import { Base } from "src/core/shared/domain/base";



export class Opcion extends Base{
    
    nombre: string;

    icono:string;
    
    tieneOpciones:boolean;
 
    esEmergente:boolean;

    static createOpcion(nombre: string, icono:string, tieneOpciones:boolean, esEmergente:boolean, usuarioCreacion:string){
        const opcion = new Opcion();;
        
        opcion.nombre=nombre.toUpperCase();
        opcion.icono=icono.toUpperCase();
        opcion.tieneOpciones=tieneOpciones;
        opcion.esEmergente=esEmergente;
        opcion.esEliminado=false;
        opcion.esBloqueado=false;
        opcion.fechaCreacion= new Date();
        opcion.fechaModificacion=new Date();
        opcion.usuarioCreacion= usuarioCreacion;
        opcion.usuarioModificacion=usuarioCreacion;
        return opcion;
    }

    static updateOpcion(nombre: string, icono:string, tieneOpciones:boolean, esEmergente:boolean, usuarioModificacion:string){
      const opcion = new Opcion();
      opcion.nombre=nombre?.toUpperCase();
      opcion.icono=icono?.toUpperCase();
      opcion.tieneOpciones=tieneOpciones;
      opcion.esEmergente=esEmergente;
      opcion.fechaModificacion=new Date();
      opcion.usuarioModificacion=usuarioModificacion;
      return opcion;
  }
}