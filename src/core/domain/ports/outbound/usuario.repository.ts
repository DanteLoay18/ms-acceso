import { Usuario } from "../../entity/collections/usuario.collection";


export interface UsuarioRepository{

    findOneById(id:string):Promise<Usuario>;
    findAll():Promise<Usuario[]>;
    updateUsuario(id:string,usuario:Usuario):Promise<Usuario>;
    actualizarBloqueo(id:string,esBloqueado:boolean):Promise<Usuario>;
    resetPassword(id:string,usuario:Usuario): Promise<Usuario>;
    deleteUsuario(id:string):Promise<Usuario>;
}