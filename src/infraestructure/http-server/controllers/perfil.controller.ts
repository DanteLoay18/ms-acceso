import { ApiBearerAuth, ApiInternalServerErrorResponse, ApiTags } from "@nestjs/swagger";
import { Controller, UseGuards, Get, Param, Put,Delete ,Body, Post, ParseUUIDPipe } from '@nestjs/common';
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/infraestructure/adapters/jwt/decorators/get-user.decorator";
import { Usuario } from "src/core/domain/entity/collections/usuario.collection";
import { PerfilByIdQuery, PerfilesAllQuery } from "src/core/application/feautures/Perfil/read";
import { CreatePerfilCommand, DeletePerfilCommand, UpdatePerfilCommand } from "src/core/application/feautures/Perfil/write";
import { CreatePerfilRequest, UpdatePerfilRequest } from "../model";

@ApiTags('Perfil')
@Controller('/perfil')
export class PerfilController{

    constructor(
        private command: CommandBus,
        private query: QueryBus
    ) {}
    
    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Get('')
    async findAllPerfils() {
        return await this.query.execute(new PerfilesAllQuery());
        
    }
    
    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Get(':id')
    async findPerfilById(@Param('id', ParseUUIDPipe) id:string) {
        return await this.query.execute(new PerfilByIdQuery(id));
        
    }

    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Post()
    async createPerfil(@GetUser() usuario:Usuario,
                        @Body() createPerfilRequest:CreatePerfilRequest) {
        return await this.command.execute(new CreatePerfilCommand(createPerfilRequest, usuario));
        
    }


    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Put(':id')
    async updatePerfil(@GetUser() usuario:Usuario,
                        @Param('id', ParseUUIDPipe) id:string,
                        @Body() updatePerfilRequest:UpdatePerfilRequest) {
        return await this.command.execute(new UpdatePerfilCommand(id,updatePerfilRequest, usuario));
        
    }

    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Delete(':id')
    async deletePerfil(@Param('id', ParseUUIDPipe) id:string) {
        return await this.command.execute(new DeletePerfilCommand(id));
        
    }
   
}