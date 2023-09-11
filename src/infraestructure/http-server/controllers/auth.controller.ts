
import { Controller} from '@nestjs/common';

import { CommandBus, QueryBus } from "@nestjs/cqrs";

import { RegisterUsuarioCommand } from '../../../core/application/feautures/Auth/write/register/registerUsuario.command';
import { LoginUsuarioCommand } from "src/core/application/feautures/Auth/write/login";
import { LoginUsuarioRequest } from "../model/usuario/login-usuario.request";
import { UpdateUsuarioPasswordCommand } from "src/core/application/feautures/Auth/write/update/updatePassword.command";
import {  UpdatePasswordRequest } from "../model";
import {MessagePattern} from '@nestjs/microservices'
import { CreateUsuarioRequest } from "../model/usuario/create-usuario.request";
import { CheckStatusUsuarioCommand } from 'src/core/application/feautures/Auth/write/status/checkStatus.command';

@Controller()
export class UserController{

    constructor(
        private command: CommandBus,
        private query: QueryBus
    ) {}
    
    
    @MessagePattern({cmd: 'registro_usuario'})
    async createUsuario({registerUsuarioRequest, usuario}: CreateUsuarioRequest) {
        const {nombres, apellidos, email, error, message}=  await this.command.execute(new RegisterUsuarioCommand(registerUsuarioRequest, usuario))
        
        if(error)
            return {
                error,
                message
            }
        

        return {
            nombres, 
            apellidos,
            email
        }
    }
    
    @MessagePattern({cmd: 'login_usuario'})
    async loginUsuario(loginUsuarioDto:LoginUsuarioRequest) {

        
        const {token,_doc, error, message}=await this.command.execute(new LoginUsuarioCommand(loginUsuarioDto));
        if(error)
            return {
                error,
                message
            }
        

            
        delete _doc.password;
        delete _doc._id;

        return {
            token,
            ..._doc
        };
    }

    @MessagePattern({cmd: 'checkstatus_usuario'})
    async checkAuthStatus({usuario}:any) {

        
        const {token,_doc, error, message} = await this.command.execute(new CheckStatusUsuarioCommand(usuario));
        
        if(error)
        return {
            error,
            message
        }
    

        
        delete _doc.password;
        delete _doc._id;

        return {
            token,
            ..._doc
        };
    }

    @MessagePattern({cmd: 'update_password'})
    async updatePassword({id, password, usuario}:UpdatePasswordRequest) {

        const {nombres, email, apellidos, error, message} = await this.command.execute(new UpdateUsuarioPasswordCommand(id, password, usuario));

        if(error)
        return {
            error,
            message
           }
       return {
        nombres, email, apellidos
       }
        
        
    }
}