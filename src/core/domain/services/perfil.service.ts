import { Perfil } from "../entity/collections";
import { PerfilRepository } from "../ports/outbound";

export class PerfilService{
    constructor(private readonly perfilRepository:PerfilRepository){}

    findAll(){
       return this.perfilRepository.findAll();
    }

    findOneById(id:string){
        return this.perfilRepository.findOneById(id);
    }
    
    findOneByTipo(tipo:string){
        return this.perfilRepository.findByTipo(tipo);
    }


    createPerfil(perfil:Perfil){
        return this.perfilRepository.createPerfil(perfil);
    }

    updatePerfil(id:string,perfil:Perfil){
        return this.perfilRepository.updatePerfil(id,perfil);
    }

    deletePerfil(id:string){
        return this.perfilRepository.deletePerfil(id);
    }

    bloquearPerfil(id:string, esBloqueado:boolean){
        return this.perfilRepository.actualizarBloqueo(id, esBloqueado);
    }
}