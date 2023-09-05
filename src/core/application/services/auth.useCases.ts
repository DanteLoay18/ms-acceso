import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Usuario } from "src/core/domain/entity/collections/usuario.collection";
import { AuthService } from "src/core/domain/services/auth.service";
import * as bcrypt from 'bcrypt'
import { LoginUsuarioDto } from "src/core/shared/dtos/usuario/login-usuario.dto";
import { JwtPayload } from "src/infraestructure/adapters/jwt/interfaces/jwt-payload.interface";
import { JwtService } from "@nestjs/jwt";
import { UsuarioUseCases } from "./usuario.useCases";
import { RegisterUsuarioDto, UsuarioDto } from "src/core/shared/dtos";
@Injectable()
export class AuthUseCases{
    constructor(private readonly authService:AuthService,
                private readonly jwtService: JwtService,
                private readonly usuarioUseCases:UsuarioUseCases){}

    async registerUsuario(registerUsuarioDto:RegisterUsuarioDto, usuarioDto:UsuarioDto){
        try {

           
            const usuarioEncontradoNombres=await this.findOneByTerm(registerUsuarioDto.nombres)
            const usuarioEncontradoEmail=await this.findOneByTerm(registerUsuarioDto.email)

            if(usuarioEncontradoEmail || usuarioEncontradoNombres)
            throw new BadRequestException(`Los datos ingresados ya estan registrados`);

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
            const usuario = await this.findOneByTerm(email)

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
            
            
            if(usuarioEncontrado.esBloqueado)
                throw new BadRequestException(`Usuario se encuentra en modificacion`)

            await this.usuarioUseCases.bloquearUsuario(id, true);

            const usuario = Usuario.updatePassword(password,usuarioModificacion._id)
            
            return await this.authService.updatePassword(id, {
                ...usuario,
                password: bcrypt.hashSync(password,10),
            });

        } catch (error) {
            this.handleExceptions(error);
        }
        finally{
            await this.usuarioUseCases.bloquearUsuario(id, false);
        }

        
        
          
    }

    async findOneByTerm(term:string){
        try {
            let usuario=await this.authService.findByName(term.toUpperCase());
            
            if(!usuario)
                usuario= await this.authService.findByEmail(term);

            return usuario;

            
        } catch (error) {
            this.handleExceptions(error)
        }
    }
    private gwtJwtToken(payload: JwtPayload){
        const token = this.jwtService.sign(payload);

        return token;
    }


    private handleExceptions(error:any){
        
        if(error.code==="23505")
        throw new BadRequestException(error.detail)
        
        

        throw new BadRequestException(error.message)
      }
    
    
}