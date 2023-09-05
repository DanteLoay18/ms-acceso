import { Sistema } from "../../entity/collections";


export interface SistemaRepository{
    createSistema(sistema: Sistema): Promise<Sistema>;
    findOneById(id:string):Promise<Sistema>;
    findAll():Promise<Sistema[]>;
    findByNombre(nombre:string):Promise<Sistema>
    updateSistema(id:string,Sistema:Sistema): Promise<Sistema>;
    deleteSistema(id:string): Promise<Sistema>;
    actualizarBloqueo(id:string,esBloqueado:boolean):Promise<Sistema>;
}