
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

    getSistemasSlice(limit: number, offset: number) {
        return this.sistemaRepository.findBySlice(limit, offset)
    }

    getSistemasCount() {
        return this.sistemaRepository.count()
    }

    getSistemasByBusquedaSlice(nombre:string, icono:string, puerto:string, url:string,limit: number, offset: number) {
        return this.sistemaRepository.findByBusquedaSlice(nombre, icono, puerto, url,limit, offset)
    }

    getSistemasByBusquedaCount(nombre:string, icono:string, puerto:string, url:string, limit:number) {
        return this.sistemaRepository.findByBusquedaSlice(nombre, icono, puerto, url,limit, 0)
    }

    createSistema(sistema:Sistema){
        return this.sistemaRepository.createSistema(sistema);
    }

    updateSistema(id:string,sistema:Sistema){
        return this.sistemaRepository.updateSistema(id,sistema);
    }

    deleteSistema(id:string, sistema:Sistema){
        return this.sistemaRepository.deleteSistema(id,sistema);
    }

    bloquearSistema(id:string, esBloqueado:boolean){
        return this.sistemaRepository.actualizarBloqueo(id, esBloqueado);
    }

}