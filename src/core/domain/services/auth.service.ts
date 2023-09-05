import { Usuario } from "../entity/collections/usuario.collection";
import { AuthRepository } from "../ports/outbound/auth.repository";


export class AuthService{
    constructor(private readonly authRepository:AuthRepository){}

    registerUsuario(usuario:Usuario){
       return this.authRepository.register(usuario);
    }

    loginUsuario(username:string){
        return this.authRepository.findOneByName(username);
    }

     updatePassword(id:string,usuario:Usuario){
        
        return  this.authRepository.updatePassword(id,usuario);
    }
}