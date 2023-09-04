import { ApiInternalServerErrorResponse, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Controller, Post, Body, Get, Param, ParseUUIDPipe } from "@nestjs/common";

import { CommandBus, QueryBus } from "@nestjs/cqrs";

import { AppResponse } from "../model/app.response";
import { RegisterUsuarioRequest } from "../model/register-usuario.request";
import { RegisterUsuarioCommand } from '../../../core/application/feautures/Auth/write/register/registerUsuario.command';

@ApiTags('Auth')
@Controller('/auth')
export class UserController{

    constructor(
        private command: CommandBus,
        private query: QueryBus
    ) {}
    
    @ApiInternalServerErrorResponse({ description: 'Error server'})
    // @ApiResponse({ description: "Order Created", type: OrderCreatedDto })
    @Post('register')
    async createUser(@Body() registerUserRequest: RegisterUsuarioRequest): Promise<AppResponse> {
        const {nombres, apellidos, email, password}=  await this.command.execute(new RegisterUsuarioCommand(registerUserRequest))
        return {
            status: 200,
            message: 'Product Created',
            data: {nombres, apellidos, email, password}
        }
    }

    // @ApiInternalServerErrorResponse({ description: 'Error server'})
    // // @ApiResponse({ description: "Order Created", type: OrderCreatedDto })
    // @Get(':id')
    // async findOneById(@Param('id', new ParseUUIDPipe({version:'4'})) id: string): Promise<AppResponse> {
    //     const {nombre, apellidos} = await this.query.execute(new UsuarioQueryById(id));
    //     return {
    //         status: 200,
    //         message: 'Product Created',
    //         data: {nombre, apellidos}
    //     }
    // }
}