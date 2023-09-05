import { ApiBearerAuth, ApiInternalServerErrorResponse, ApiTags } from "@nestjs/swagger";
import { Controller, UseGuards, Get, Param, Put,Delete ,Body, ParseUUIDPipe } from '@nestjs/common';
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AuthGuard } from "@nestjs/passport";
import { UsuariosAllQuery } from "src/core/application/feautures/Usuario/read/usuariosAll.query";
import { UsuarioByIdQuery } from "src/core/application/feautures/Usuario/read/usuarioById.query";
import { UpdateUsuarioCommand } from "src/core/application/feautures/Usuario/write/update/updateUsuario.command";
import { GetUser } from "src/infraestructure/adapters/jwt/decorators/get-user.decorator";
import { Usuario } from "src/core/domain/entity/collections/usuario.collection";
import { DeleteUsuarioCommand } from "src/core/application/feautures/Usuario/write/delete/deleteUsuario.command";
import { ResetPasswordUsuarioCommand } from "src/core/application/feautures/Usuario/write/update-password/resetPassword.command";
import { UpdateUsuarioRequest } from "../model";

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
    async findUsuarioById(@Param('id', ParseUUIDPipe) id:string) {
        return await this.query.execute(new UsuarioByIdQuery(id));
        
    }

    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Put(':id')
    async updateUsuario(@GetUser() usuario:Usuario,
                        @Param('id', ParseUUIDPipe) id:string,
                        @Body() updateUsuarioRequest:UpdateUsuarioRequest) {
        return await this.command.execute(new UpdateUsuarioCommand(id,updateUsuarioRequest, usuario));
        
    }

    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Put('/reset/:id')
    async resetPasswordUsuario(@GetUser() usuario:Usuario,
                               @Param('id') id:string
                               ) {
                                
        return await this.command.execute(new ResetPasswordUsuarioCommand(id, usuario));
        
    }

    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Delete(':id')
    async deleteUsuario(@Param('id') id:string) {
        return await this.command.execute(new DeleteUsuarioCommand(id));
        
    }
   
}