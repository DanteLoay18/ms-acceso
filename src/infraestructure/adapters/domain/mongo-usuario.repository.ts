import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Usuario } from "src/core/domain/entity/collections/usuario.collection";
import { UsuarioRepository } from "src/core/domain/ports/outbound/usuario.repository";

@Injectable()
export class MongoUsuarioRepository implements UsuarioRepository {
    
    constructor(@InjectModel(Usuario.name) private usuarioRepository: Model<Usuario>) { }
   
    
    
    
    findOneById(id: string): Promise<Usuario> {
        return this.usuarioRepository.findById(id);
    }
    findAll(): Promise<Usuario[]> {
        return this.usuarioRepository.find();
    }
    updateUsuario(usuario: Usuario): Promise<Usuario> {
        throw new Error("Method not implemented.");
    }
    
    actualizarBloqueo(id:string,esBloqueado: boolean): Promise<Usuario> {
        console.log(esBloqueado)
        return this.usuarioRepository.findByIdAndUpdate(id, {

                                                                esBloqueado  
                                                                }, {new:true})

    }
    
   

   

}