import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException,  } from "@nestjs/common";
import { Usuario } from "src/core/domain/entity/collections/usuario.collection";
import { UsuarioService } from "src/core/domain/services/usuario.service";
import { UsuarioDto } from "src/core/shared/dtos/usuario.dto";
import * as bcrypt from 'bcrypt';
import { UpdateUsuarioDto } from "src/core/shared/dtos";
import { AuthUseCases } from "./auth.useCases";
import { AuthService } from "src/core/domain/services";
import { PerfilService } from "src/core/domain/services/perfil.service";
import { Perfil } from '../../domain/entity/collections/perfil.collection';


@Injectable()
export class UsuarioUseCases{
    constructor(private readonly usuarioService:UsuarioService, private authService:AuthService, private perfilService:PerfilService){}

    async getUsuarioById(id:string){
        try{
            const user= await this.usuarioService.findOneById(id);

            if(!user || user.esEliminado)
                throw new NotFoundException(`El usuario con el id ${id} no existe`)

            return user;
        }catch(error){
            this.handleExceptions(error)
        }
        
    }

    async getAllUsuarios(){
        
        try{
            return await this.usuarioService.findAll();
        }catch(error){
            this.handleExceptions(error)
        }
       
    }
    async updateUsuario(id:string, updateUsarioDto:UpdateUsuarioDto, usuarioModificacion:UsuarioDto ){
        
        //TODO: AGREGAR LOS PERFILES EN LA ACTUALIZACION MAS NO AL CREARLO
        try {
            
            const usuarioEncontrado = await this.getUsuarioById(id);
            
            if(usuarioEncontrado.esBloqueado)
                throw new BadRequestException(`Usuario se encuentra en modificacion`)

            await this.bloquearUsuario(id, true);

            if(updateUsarioDto.nombres)
                 await this.findOneByTerm(updateUsarioDto.nombres,id)
              
                

            if(updateUsarioDto.email)
              await this.findOneByTerm(updateUsarioDto.email,id);

            if(updateUsarioDto.perfiles?.length>0){
                const perfilPromises = updateUsarioDto.perfiles.map(async ({perfil}) => {
                    const perfilEncontrado = await this.perfilService.findOneById(perfil);
                   
                    if(!perfilEncontrado || perfilEncontrado.esEliminado ){
                      return {perfil, valido:false}
                    }
                   
                    return { perfil, valido: true };
                  });
                
                  const perfilesResultados = await Promise.all(perfilPromises);
                
                  
                  const perfilesInvalidos = perfilesResultados.filter((resultado) => !resultado.valido);
                
                  
                  if (perfilesInvalidos.length > 0) 
                    perfilesInvalidos.forEach((resultado) => {throw new NotFoundException(`Perfil con el Id ${resultado.perfil} no esta registrado`)})
            }

            
                
            
            const usuario = Usuario.updateUsuario(updateUsarioDto.nombres,updateUsarioDto.apellidos,updateUsarioDto.email,updateUsarioDto.perfiles,usuarioModificacion._id)
            
            return await this.usuarioService.updateUsuario(id, usuario);

        } catch (error) {
            this.handleExceptions(error);
        }
        finally{
            await this.bloquearUsuario(id, false);
        }
       
    }

    async deleteUsuario(id:string){
        try {
            await this.getUsuarioById(id);

            return await this.usuarioService.deleteUsuario(id);

        } catch (error) {
            this.handleExceptions(error);
        }
    }

    async resetUsuarioPassword(id:string, usuarioModificacion:UsuarioDto){
        
        
        try {
            
            const usuarioEncontrado = await this.getUsuarioById(id);
            
           
            if(usuarioEncontrado.esBloqueado)
                throw new BadRequestException(`Usuario se encuentra en modificacion`)

            await this.bloquearUsuario(id, true);

            const usuario = Usuario.updatePassword(usuarioEncontrado.defaultPassword,usuarioModificacion._id)
            
            return await this.usuarioService.resetPassword(id, {
                ...usuario,
                password: bcrypt.hashSync(usuario.password,10),
            });

        } catch (error) {
            this.handleExceptions(error);
        }
        finally{
            await this.bloquearUsuario(id, false);
        }

        
        
          
    }



    async bloquearUsuario(id:string, esBloqueado:boolean){
        try {
            return await this.usuarioService.bloquearUsuario(id, esBloqueado);
        } catch (error) {
            this.handleExceptions(error)
        }
    }
    


    private handleExceptions(error:any){
        
        if(error.code==="23505")
        throw new BadRequestException(error.detail)
        
        

        throw new BadRequestException(error.message)
      }

      private async findOneByTerm(term:string, id:string){

        let usuario= await this.authService.findByEmail(term.toUpperCase());

       
        if(usuario && usuario._id !== id){
            throw new BadRequestException(`El email ${term} ya esta registrado`)
        }
            
        

        return usuario;

        
    }
}