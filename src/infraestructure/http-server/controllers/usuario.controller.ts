import { ApiBearerAuth, ApiInternalServerErrorResponse, ApiTags } from "@nestjs/swagger";
import { Controller, UseGuards, Get, Param, Put,Delete ,Body } from '@nestjs/common';
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AuthGuard } from "@nestjs/passport";
import { UsuariosAllQuery } from "src/core/application/feautures/Usuario/read/usuariosAll.query";
import { UsuarioByIdQuery } from "src/core/application/feautures/Usuario/read/usuarioById.query";
import { UpdateUsuarioCommand } from "src/core/application/feautures/Usuario/write/update/updateUsuario.command";
import { GetUser } from "src/infraestructure/adapters/jwt/decorators/get-user.decorator";
import { Usuario } from "src/core/domain/entity/collections/usuario.collection";
import { UpdateUsuarioRequest } from "../model/update-usuario.request";
import { DeleteUsuarioCommand } from "src/core/application/feautures/Usuario/write/delete/deleteUsuario.command";

@ApiTags('Usuario')
@Controller('/usuario')
export class UsuarioController{

    constructor(
        private command: CommandBus,
        private query: QueryBus
    ) {}
    
    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Get('')
    async findAllUsuarios() {
        return await this.query.execute(new UsuariosAllQuery());
        
    }
    
    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Get(':id')
    async findUsuarioById(@Param('id') id:string) {
        return await this.query.execute(new UsuarioByIdQuery(id));
        
    }

    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Put(':id')
    async updateUsuario(@GetUser() usuario:Usuario,
                        @Param('id') id:string,
                        @Body() updateUsuarioRequest:UpdateUsuarioRequest) {
        return await this.command.execute(new UpdateUsuarioCommand(id,updateUsuarioRequest, usuario));
        
    }

    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Delete(':id')
    async deleteUsuario(@Param('id') id:string) {
        return await this.command.execute(new DeleteUsuarioCommand(id));
        
    }
   
}