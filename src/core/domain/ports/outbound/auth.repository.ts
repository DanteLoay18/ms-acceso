import { Usuario } from "../../entity/collections/usuario.collection";


export interface AuthRepository{

    register(usuario: Usuario): Promise<Usuario>;
    login(username:string, password:string):Promise<Usuario>;
    
}