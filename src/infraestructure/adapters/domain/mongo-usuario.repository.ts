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
        return this.usuarioRepository.find({esEliminado:false});
    }
    updateUsuario(id:string,usuario: Usuario): Promise<Usuario> {
        
        return this.usuarioRepository.findByIdAndUpdate(id, usuario, {new:true})
    }
    
    actualizarBloqueo(id:string,esBloqueado: boolean): Promise<Usuario> {
        
        return this.usuarioRepository.findByIdAndUpdate(id, {

                                                                esBloqueado  
                                                                }, {new:true})

    }

    resetPassword(id: string, usuario: Usuario): Promise<Usuario> {
        return  this.usuarioRepository.findByIdAndUpdate(id,usuario, 
                                                    { new: true });
    }
    deleteUsuario(id: string): Promise<Usuario> {
        return this.usuarioRepository.findByIdAndUpdate(id, {
                                                        esEliminado:true  
                                                        }, {new:true})
    }
    
   

   

}