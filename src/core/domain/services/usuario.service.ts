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

    updateUsuario(usuario:Usuario){
        return this.usuarioRepository.updateUsuario(usuario);
    }
}