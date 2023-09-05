import { Sistema } from "../../entity/collections";


export interface SistemaRepository{

    createOpcion(opcion: Sistema): Promise<Sistema>;
    findOneById(id:string):Promise<Sistema>;
    findAll():Promise<Sistema[]>;
    updateSistema(id:string,Sistema:Sistema): Promise<Sistema>;
    deleteSistema(id:string): Promise<Sistema>;
    actualizarBloqueo(id:string,esBloqueado:boolean):Promise<Sistema>;
}