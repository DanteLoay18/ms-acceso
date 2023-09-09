import { Base } from "src/core/shared/domain/base";
import { SistemasDto } from "../sistemas.dto";

export class Perfil extends Base{

    tipo: string;
  
    sistemas: SistemasDto[];

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
  static deletePerfil(usuarioModificacion:string){
    const perfil = new Perfil();
    perfil.esEliminado=true;
    perfil.fechaModificacion=new Date();
    perfil.usuarioModificacion=usuarioModificacion;
    return perfil;
}
}
