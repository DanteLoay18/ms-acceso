import { BadRequestException, Injectable  } from "@nestjs/common";
import { Usuario } from "src/core/domain/entity/collections/usuario.collection";
import { UsuarioService } from "src/core/domain/services/usuario.service";
import * as bcrypt from 'bcrypt';
import { UpdateUsuarioDto } from "src/core/shared/dtos";
import { AuthService } from "src/core/domain/services";
import { PerfilService } from "src/core/domain/services/perfil.service";

@Injectable()
export class UsuarioUseCases{
    constructor(private readonly usuarioService:UsuarioService, private authService:AuthService, private perfilService:PerfilService){}

    async getUsuarioById(id:string){
        try{
            const user= await this.usuarioService.findOneById(id);
            
            if(!user || user.esEliminado)
            return {error: 404, message: `El usuario con el id ${id} no existe`}
              

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
    async updateUsuario(id:string, updateUsarioDto:UpdateUsuarioDto, usuarioModificacion:string ){
        
        try {
            
            const usuarioEncontrado = await this.getUsuarioById(id);
            
            if(usuarioEncontrado['error'])
                return {error: usuarioEncontrado['error'], message: usuarioEncontrado['message']}


            if(usuarioEncontrado['esBloqueado'])
                return {
                        error: 400,
                        message: `Usuario se encuentra en modificacion`
                        }
        

            await this.bloquearUsuario(id, true);

            
            if(updateUsarioDto.email){
                const emailEncontrado= await this.findOneByTerm(updateUsarioDto.email,id);
                

                if(emailEncontrado?.['error'])
                return {
                    error: emailEncontrado['error'],
                    message: emailEncontrado['message']
                    }

            }

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
                    return {
                            status:400,
                            message:`Perfil con el Id ${perfilesInvalidos[0].perfil} no esta registrado`
                                }
                                                                
            }
            
            
            const usuario = Usuario.updateUsuario(updateUsarioDto.nombres,updateUsarioDto.apellidos,updateUsarioDto.email,updateUsarioDto.perfiles,usuarioModificacion)
            
            return await this.usuarioService.updateUsuario(id, usuario);

        } catch (error) {
            this.handleExceptions(error);
        }
        finally{
            await this.bloquearUsuario(id, false);
        }
       
    }

    async deleteUsuario(id:string, usuarioModificacion:string){
        try {
            
            const usuarioEncontrado = await this.getUsuarioById(id);

            if(usuarioEncontrado['error'])
                return {error: usuarioEncontrado['error'], message: usuarioEncontrado['message']}
            const usuario = Usuario.deleteUsuario(usuarioModificacion)
            return await this.usuarioService.deleteUsuario(id, usuario);

        } catch (error) {
            this.handleExceptions(error);
        }
    }

    async resetUsuarioPassword(id:string, usuarioModificacion:string){
        
        
        try {
            
            const usuarioEncontrado = await this.getUsuarioById(id);
            
           
            if(usuarioEncontrado['esBloqueado'])
                throw new BadRequestException(`Usuario se encuentra en modificacion`)

            await this.bloquearUsuario(id, true);

            const usuario = Usuario.updatePassword(usuarioEncontrado['defaultPassword'],usuarioModificacion, true)
            
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

        let usuario= await this.authService.findByEmail(term);
        
        
        if(usuario && usuario._id !== id){
            return {
                error: 400,
                message: `El email ${term} ya esta registrado`
            }
        }
            
        

        return usuario;

        
    }
}