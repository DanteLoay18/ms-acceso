import { Usuario } from "../../entity/collections/usuario.collection";


export interface UsuarioRepository{

    findOneById(id:string):Promise<Usuario>;
    findAll():Promise<Usuario[]>;
    updateUsuario(usuario:Usuario):Promise<Usuario>;
    actualizarBloqueo(id:string,esBloqueado:boolean):Promise<Usuario>
}