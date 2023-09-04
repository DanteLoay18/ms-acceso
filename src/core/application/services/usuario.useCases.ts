import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Usuario } from "src/core/domain/entity/collections/usuario.collection";
import { RegisterUsuarioDto } from "src/core/shared/dtos/register-usuario.dto";
import * as bcrypt from 'bcrypt'
import { LoginUsuarioDto } from "src/core/shared/dtos/login-usuario.dto";
import { JwtPayload } from "src/infraestructure/adapters/jwt/interfaces/jwt-payload.interface";
import { JwtService } from "@nestjs/jwt";
import { UsuarioDto } from "src/core/shared/dtos/usuario.dto";
import { UsuarioService } from "src/core/domain/services/usuario.service";
@Injectable()
export class UsuarioUseCases{
    constructor(private readonly usuarioService:UsuarioService){}

    async getUsuarioById(id:string){
        const user= this.usuarioService.findOneById(id);

        if(!user)
            throw new NotFoundException(`El usuario con el id ${id} no existe`)

        return user;
    }

    async getAllUsuarios(){
        

        return this.usuarioService.findAll();
    }


    private handleExceptions(error:any){
        
        if(error.code==="23505")
        throw new BadRequestException(error.detail)
        
        

        console.log(error);
        throw new InternalServerErrorException('Please check server logs')
      }
}