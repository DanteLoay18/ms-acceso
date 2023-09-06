import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { AuthRepository } from "src/core/domain/ports/outbound/auth.repository";
import { Usuario } from "src/infraestructure/persistence/db/entities";

@Injectable()
export class MongoAuthRepository implements AuthRepository {
    
    constructor(@InjectModel(Usuario.name) private authRepository: Model<Usuario>) { }
    
    
    findOneByEmail(email: string): Promise<Usuario> {
        return this.authRepository.findOne({email}).populate([
            {path:'usuarioCreacion',select: 'email nombres apellidos '},
            {path:'usuarioModificacion',select: 'email nombres apellidos '}
             ]) ;
    }
    
    
   
    findOneByName(nombres: string): Promise<Usuario> {
        
        return this.authRepository.findOne({nombres}).populate([
                                                                {path:'usuarioCreacion',select: 'email nombres apellidos '},
                                                                {path:'usuarioModificacion',select: 'email nombres apellidos '}
                                                                 ]) ;
    }

    
    
    register(usuario: Usuario): Promise<Usuario> {
        return this.authRepository.create(usuario);
    }

     async updatePassword(id: string, usuario: Usuario): Promise<Usuario> {
       
        return  this.authRepository.findByIdAndUpdate(id,usuario, 
                                                    { new: true });
      
      }
}