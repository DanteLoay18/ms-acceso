import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException,  } from "@nestjs/common";
import { UsuarioService } from "src/core/domain/services/usuario.service";


@Injectable()
export class UsuarioUseCases{
    constructor(private readonly usuarioService:UsuarioService){}

    async getUsuarioById(id:string){
        try{
            const user= await this.usuarioService.findOneById(id);

            if(!user)
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

    


    private handleExceptions(error:any){
        
        if(error.code==="23505")
        throw new BadRequestException(error.detail)
        
        

        console.log(error);
        throw new InternalServerErrorException('Please check server logs')
      }
}