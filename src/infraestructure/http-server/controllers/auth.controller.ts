import { ApiBearerAuth, ApiInternalServerErrorResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Controller, Post, Body, Get, Param, UseGuards } from "@nestjs/common";

import { CommandBus, QueryBus } from "@nestjs/cqrs";

import { AppResponse } from "../model/app.response";
import { RegisterUsuarioRequest } from "../model/register-usuario.request";
import { RegisterUsuarioCommand } from '../../../core/application/feautures/Auth/write/register/registerUsuario.command';
import { LoginUsuarioCommand } from "src/core/application/feautures/Auth/write/login";
import { LoginUsuarioRequest } from "../model/login-usuario.request";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/infraestructure/adapters/jwt/decorators/get-user.decorator";
import { Usuario } from "src/core/domain/entity/collections/usuario.collection";


@ApiTags('Auth')
@Controller('/auth')
export class UserController{

    constructor(
        private command: CommandBus,
        private query: QueryBus
    ) {}
    
    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Post('register')
    async createUsuario(
        @GetUser() usuario:Usuario,
        @Body() registerUserRequest: RegisterUsuarioRequest
        ) {
        
        const {nombres, apellidos, email}=  await this.command.execute(new RegisterUsuarioCommand(registerUserRequest))
        return {
            nombres, 
            apellidos,
            email
        }
    }
    

    @ApiInternalServerErrorResponse({ description: 'Error server'})
    // @ApiResponse({ description: "Order Created", type: OrderCreatedDto })
    @Post('login')
    async loginUsuario(@Body() loginUsuarioDto:LoginUsuarioRequest) {
        const {token,_doc}=await this.command.execute(new LoginUsuarioCommand(loginUsuarioDto));
        delete _doc.password;
        delete _doc._id;
        return {
            token,
            ..._doc
        };
    }
}