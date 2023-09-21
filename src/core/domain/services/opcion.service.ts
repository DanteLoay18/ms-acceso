
import { Opcion } from "../entity/collections/opcion.collection";
import { OpcionRepository } from "../ports/outbound";


export class OpcionService{
    constructor(private readonly opcionRepository:OpcionRepository){}


    findOneById(id:string){
        return this.opcionRepository.findOneById(id);
    }
    
    findOneByNombre(nombre:string){
        return this.opcionRepository.findByNombre(nombre);
    }

    findOneByIcono(icono:string){
        return this.opcionRepository.findByIcono(icono);
    }

     getOpcionesSlice(limit: number, offset: number) {
        return this.opcionRepository.findBySlice(limit, offset)
    }

    getOpcionesCount() {
        return this.opcionRepository.count()
    }

    getOpcionesByBusquedaSlice(nombre:string, icono:string, esEmergente:boolean,limit: number, offset: number) {
        return this.opcionRepository.findByBusquedaSlice(nombre, icono, esEmergente,limit, offset)
    }

    getOpcionesByBusquedaCount(nombre:string, icono:string, esEmergente:boolean, limit:number) {
        return this.opcionRepository.findByBusquedaSlice(nombre, icono, esEmergente,limit, 0)
    }

    createOpcion(opcion:Opcion){
        return this.opcionRepository.createOpcion(opcion);
    }

    updateOpcion(id:string,opcion:Opcion){
        return this.opcionRepository.updateOpcion(id,opcion);
    }

    deleteOpcion(id:string, opcion:Opcion){
        return this.opcionRepository.deleteOpcion(id, opcion);
    }

    bloquearOpcion(id:string, esBloqueado:boolean){
        return this.opcionRepository.actualizarBloqueo(id, esBloqueado);
    }

}