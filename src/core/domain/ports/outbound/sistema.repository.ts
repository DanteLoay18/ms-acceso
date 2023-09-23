import { Sistema } from "../../entity/collections";


export interface SistemaRepository{
    createSistema(sistema: Sistema): Promise<Sistema>;
    findOneById(id:string):Promise<Sistema>;
    findAll():Promise<Sistema[]>;
    findByNombre(nombre:string):Promise<Sistema>;
    findBySlice(limit: number, offset: number): Promise<Sistema[]>
    findByBusquedaSlice(nombre:string, icono:string, puerto:string, url:string, limit: number, offset: number):Promise<Sistema[]>
    count(): Promise<number>
    updateSistema(id:string,sistema:Sistema): Promise<Sistema>;
    deleteSistema(id:string, sistema:Sistema): Promise<Sistema>;
    actualizarBloqueo(id:string,esBloqueado:boolean):Promise<Sistema>;
}