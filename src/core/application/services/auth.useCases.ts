import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Usuario } from "src/core/domain/entity/collections/usuario.collection";
import { AuthService } from "src/core/domain/services/auth.service";
import { RegisterUsuarioDto } from "src/core/shared/dtos/register-usuario.dto";
import * as bcrypt from 'bcrypt'
import { LoginUsuarioDto } from "src/core/shared/dtos/login-usuario.dto";
import { JwtPayload } from "src/infraestructure/adapters/jwt/interfaces/jwt-payload.interface";
import { JwtService } from "@nestjs/jwt";
@Injectable()
export class AuthUseCases{
    constructor(private readonly authService:AuthService,
                private readonly jwtService: JwtService){}

    async registerUsuario(registerUsuarioDto:RegisterUsuarioDto){
        try {
            const {password,...rest} = Usuario.create(registerUsuarioDto.nombres, registerUsuarioDto.apellidos, registerUsuarioDto.email,registerUsuarioDto.password);
            

            return this.authService.registerUsuario(
                                    {
                                     ...rest, 
                                     password: bcrypt.hashSync(password, 10)
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