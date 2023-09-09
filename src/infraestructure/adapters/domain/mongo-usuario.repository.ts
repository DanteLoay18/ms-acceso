import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UsuarioRepository } from "src/core/domain/ports/outbound/usuario.repository";
import { Usuario } from "src/infraestructure/persistence/db/entities";

@Injectable()
export class MongoUsuarioRepository implements UsuarioRepository {
    
    constructor(@InjectModel(Usuario.name) private usuarioRepository: Model<Usuario>) { }
    
    
   
    
    
    
    findOneById(id: string): Promise<Usuario> {
        return this.usuarioRepository.findById(id).populate([
                                                    {path:'usuarioCreacion',select: 'email nombres apellidos esEliminado'},
                                                    {path:'usuarioModificacion',select: 'email nombres apellidos esEliminado '},
                                                    {path:'perfiles.perfil',select: 'tipo sistemas esEliminado'}
                                                    ]) ;
    }
    findAll(): Promise<Usuario[]> {
        return this.usuarioRepository.find({esEliminado:false}).populate([
                                                                            {path:'usuarioCreacion',select: 'email nombres apellidos esEliminado'},
                                                                            {path:'usuarioModificacion',select: 'email nombres apellidos esEliminado'},
                                                                            {path:'perfiles.perfil',select: 'tipo sistemas esEliminado'}
                                                                            ]) ;
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
    deleteUsuario(id: string, usuario:Usuario): Promise<Usuario> {
        return this.usuarioRepository.findByIdAndUpdate(id, usuario, {new:true})
    }
    
   

   

}