import { Usuario } from "../../entity/collections";

export interface AuthRepository{

    register(usuario: Usuario): Promise<Usuario>;
    findOneByName(name:string):Promise<Usuario>;
    findOneByEmail(email:string):Promise<Usuario>;
    updatePassword(id:string,usuario:Usuario): Promise<Usuario>;
}