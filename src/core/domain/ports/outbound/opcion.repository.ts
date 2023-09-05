import { Opcion } from "../../entity/collections/opcion.collection";


export interface OpcionRepository{

    createOpcion(opcion: Opcion): Promise<Opcion>;
    findOneById(id:string):Promise<Opcion>;
    findAll():Promise<Opcion[]>;
    updateOpcion(id:string,opcion:Opcion): Promise<Opcion>;
    deleteOpcion(id:string): Promise<Opcion>;
    actualizarBloqueo(id:string,esBloqueado:boolean):Promise<Opcion>;
}