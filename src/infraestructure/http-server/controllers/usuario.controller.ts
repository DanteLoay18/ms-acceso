import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { UsuariosAllQuery } from "src/core/application/feautures/Usuario/read/usuariosAll.query";
import { UsuarioByIdQuery } from "src/core/application/feautures/Usuario/read/usuarioById.query";
import { UpdateUsuarioCommand } from "src/core/application/feautures/Usuario/write/update/updateUsuario.command";
import { DeleteUsuarioCommand } from "src/core/application/feautures/Usuario/write/delete/deleteUsuario.command";
import { ResetPasswordUsuarioCommand } from "src/core/application/feautures/Usuario/write/update-password/resetPassword.command";
import { UpdateUsuarioRequest } from "../model";
import { MessagePattern } from '@nestjs/microservices';
import { ResetPasswordDto } from "../model/usuario/reset-password.dto";


@Controller()
export class UsuarioController{

    constructor(
        private command: CommandBus,
        private query: QueryBus
    ) {}
    
    @MessagePattern({cmd: 'findAll_usuarios'})
    async findAllUsuarios() {
        return await this.query.execute(new UsuariosAllQuery());
        
    }
    
    @MessagePattern({cmd: 'findOne_usuario'})
    async findUsuarioById(id:string) {
        return await this.query.execute(new UsuarioByIdQuery(id));
       
    }
    
    @MessagePattern({cmd: 'update_usuario'})
    async updateUsuario( {id, usuario, updateUsuarioRequest}:UpdateUsuarioRequest) {
        
        return await this.command.execute(new UpdateUsuarioCommand(id,{...updateUsuarioRequest}, usuario));
        
    }
    @MessagePattern({cmd: 'reset_password_usuario'})
    async resetPasswordUsuario({id,usuario} : ResetPasswordDto
                               ) {
                                
        return await this.command.execute(new ResetPasswordUsuarioCommand(id, usuario));
        
    }

    @MessagePattern({cmd: 'delete_usuario'})
    async deleteUsuario({id, usuario}:any) {

        return await this.command.execute(new DeleteUsuarioCommand(id, usuario));
        
    }
   
}