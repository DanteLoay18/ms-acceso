import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Usuario } from "src/core/domain/entity/collections/usuario.collection";
import { AuthService } from "src/core/domain/services/auth.service";
import { RegisterUsuarioDto } from "src/core/shared/dtos/register-usuario.dto";

@Injectable()
export class AuthUseCases{
    constructor(private readonly authService:AuthService){}

    async registerUsuario(registerUsuarioDto:RegisterUsuarioDto){
        try {
            const usuario = Usuario.create(registerUsuarioDto.nombres, registerUsuarioDto.apellidos, registerUsuarioDto.email,registerUsuarioDto.password);
            return this.authService.registerUsuario(usuario);
        } catch (error) {
            console.log(error)
            this.handleExceptions(error);
        }
       
    }

    private handleExceptions(error:any){
        if(error.code = 11000)
          throw new BadRequestException(`Usuario ya existe en la db ${JSON.stringify(error.keyValue)}`);
          
          console.log(error);
          throw new InternalServerErrorException(`No se pudo realizar la accion del pokemon - chequear los logs`)
      }
}