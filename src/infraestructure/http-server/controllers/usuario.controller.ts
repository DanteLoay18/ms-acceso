import { ApiBearerAuth, ApiInternalServerErrorResponse, ApiTags } from "@nestjs/swagger";
import { Controller, UseGuards, Post, Body, Get, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/infraestructure/adapters/jwt/decorators/get-user.decorator";
import { UsuariosAllQuery } from "src/core/application/feautures/Usuario/read/usuariosAll.query";
import { UsuarioByIdQuery } from "src/core/application/feautures/Usuario/read/usuarioById.query";

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

   
}