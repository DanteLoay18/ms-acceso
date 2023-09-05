import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Usuario } from "src/core/domain/entity/collections/usuario.collection";
import { AuthService } from "src/core/domain/services/auth.service";
import { RegisterUsuarioDto } from "src/core/shared/dtos/register-usuario.dto";
import * as bcrypt from 'bcrypt'
import { LoginUsuarioDto } from "src/core/shared/dtos/login-usuario.dto";
import { JwtPayload } from "src/infraestructure/adapters/jwt/interfaces/jwt-payload.interface";
import { JwtService } from "@nestjs/jwt";
import { UsuarioDto } from "src/core/shared/dtos/usuario.dto";
import { UsuarioUseCases } from "./usuario.useCases";
@Injectable()
export class AuthUseCases{
    constructor(private readonly authService:AuthService,
                private readonly jwtService: JwtService,
                private readonly usuarioUseCases:UsuarioUseCases){}

    async registerUsuario(registerUsuarioDto:RegisterUsuarioDto, usuarioDto:UsuarioDto){
        try {
            
            const usuario = Usuario.create(registerUsuarioDto.nombres, registerUsuarioDto.apellidos, registerUsuarioDto.email, usuarioDto._id);
            

            return this.authService.registerUsuario(
                                    {
                                     ...usuario, 
                                     password: bcrypt.hashSync(usuario.password, 10)
                                    });
            
       
        } catch (error) {
            console.log(error)
            this.handleExceptions(error);
        }
       
    }

    async loginUsuario(loginUsuarioDto:LoginUsuarioDto){
        
            const {email, password} = loginUsuarioDto;
            const usuario = await this.authService.loginUsuario(email);

            if(!usuario)
                throw new NotFoundException(`Credenciales no validas(email)`);

            if( !bcrypt.compareSync(password, usuario.password))
                throw new NotFoundException(`Credenciales no validas(password)`);
            
            

        
            return {
                    ...usuario,
                    token: this.gwtJwtToken({_id:usuario._id})
                    };

      
    }

    async updatePassword(id:string, password:string, usuarioModificacion:UsuarioDto){
        
        
        try {
            const usuarioEncontrado = await this.usuarioUseCases.getUsuarioById(id);
            
            if(!usuarioEncontrado)
                throw new NotFoundException(`Usuario con el ${id} no encontrado`);

            const usuario = Usuario.updatePassword(password,usuarioModificacion._id)
            
            return await this.authService.updatePassword(id, {
                                                                ...usuario,
                                                                password: bcrypt.hashSync(password,10),
                                                            });

        } catch (error) {
            this.handleExceptions(error);
        }
        finally{

        }

        
        
          
    }

    private gwtJwtToken(payload: JwtPayload){
        const token = this.jwtService.sign(payload);

        return token;
    }


    private handleExceptions(error:any){
        
        if(error.code==="23505")
        throw new BadRequestException(error.detail)
        
        

        console.log(error);
        throw new InternalServerErrorException('Please check server logs')
      }
    
    
}