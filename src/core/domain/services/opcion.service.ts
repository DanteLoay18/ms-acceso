
import { Opcion } from "../entity/collections/opcion.collection";
import { OpcionRepository } from "../ports/outbound";


export class OpcionService{
    constructor(private readonly opcionRepository:OpcionRepository){}

    findAll(){
       return this.opcionRepository.findAll();
    }

    findOneById(id:string){
        return this.opcionRepository.findOneById(id);
    }
    
    findOneByNombre(nombre:string){
        return this.opcionRepository.findByNombre(nombre);
    }

    findOneByIcono(icono:string){
        return this.opcionRepository.findByIcono(icono);
    }


    createOpcion(opcion:Opcion){
        return this.opcionRepository.createOpcion(opcion);
    }

    updateOpcion(id:string,opcion:Opcion){
        return this.opcionRepository.updateOpcion(id,opcion);
    }

    deleteOpcion(id:string){
        return this.opcionRepository.deleteOpcion(id);
    }

    bloquearOpcion(id:string, esBloqueado:boolean){
        return this.opcionRepository.actualizarBloqueo(id, esBloqueado);
    }

}