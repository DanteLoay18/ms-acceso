import { Perfil } from "../../entity/collections";

export interface PerfilRepository{

    createPerfil(perfil: Perfil): Promise<Perfil>;
    findOneById(id:string):Promise<Perfil>;
    findAll():Promise<Perfil[]>;
    findByTipo(tipo:string):Promise<Perfil>;
    updatePerfil(id:string,perfil:Perfil): Promise<Perfil>;
    deletePerfil(id:string, perfil:Perfil): Promise<Perfil>;
    actualizarBloqueo(id:string,esBloqueado:boolean):Promise<Perfil>;
}