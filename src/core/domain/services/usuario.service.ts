import { Usuario } from "../entity/collections/usuario.collection";
import { UsuarioRepository } from "../ports/outbound/usuario.repository";


export class UsuarioService{
    constructor(private readonly usuarioRepository:UsuarioRepository){}

    findAll(){
       return this.usuarioRepository.findAll();
    }

    findOneById(id:string){
        return this.usuarioRepository.findOneById(id);
    }

    updateUsuario(id:string,usuario:Usuario){
        return this.usuarioRepository.updateUsuario(id,usuario);
    }

    deleteUsuario(id:string){
        return this.usuarioRepository.deleteUsuario(id);
    }

    bloquearUsuario(id:string, esBloqueado:boolean){
        return this.usuarioRepository.actualizarBloqueo(id, esBloqueado);
    }
    resetPassword(id:string, usuario:Usuario){
        return this.usuarioRepository.resetPassword(id,usuario);
    }
}