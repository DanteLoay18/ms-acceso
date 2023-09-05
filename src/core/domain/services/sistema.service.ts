
import { Sistema } from "../entity/collections";
import { SistemaRepository } from "../ports/outbound/sistema.repository";


export class SistemaService{
    constructor(private readonly sistemaRepository:SistemaRepository){}

    findAll(){
       return this.sistemaRepository.findAll();
    }

    findOneById(id:string){
        return this.sistemaRepository.findOneById(id);
    }
    
    findOneByNombre(nombre:string){
        return this.sistemaRepository.findByNombre(nombre);
    }

    createSistema(sistema:Sistema){
        return this.sistemaRepository.createSistema(sistema);
    }

    updateSistema(id:string,sistema:Sistema){
        return this.sistemaRepository.updateSistema(id,sistema);
    }

    deleteSistema(id:string){
        return this.sistemaRepository.deleteSistema(id);
    }

    bloquearSistema(id:string, esBloqueado:boolean){
        return this.sistemaRepository.actualizarBloqueo(id, esBloqueado);
    }

}