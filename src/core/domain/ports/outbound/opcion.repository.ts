import { Opcion } from "../../entity/collections";

export interface OpcionRepository{

    createOpcion(opcion: Opcion): Promise<Opcion>;
    findOneById(id:string):Promise<Opcion>;
    findByNombre(nombre:string):Promise<Opcion>;
    findByIcono(icono:string):Promise<Opcion>;
    findBySlice(limit: number, offset: number): Promise<Opcion[]>
    count(): Promise<number>
    updateOpcion(id:string,opcion:Opcion): Promise<Opcion>;
    deleteOpcion(id:string, opcion:Opcion): Promise<Opcion>;
    actualizarBloqueo(id:string,esBloqueado:boolean):Promise<Opcion>;
}