import { Usuario } from "../../entity/collections/usuario.collection";


export interface AuthRepository{

    register(usuario: Usuario): Promise<Usuario>;
    findOneByName(email:string):Promise<Usuario>;
    updatePassword(id:string,usuario:Usuario): Promise<Usuario>;
}