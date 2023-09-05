import { ApiBearerAuth, ApiInternalServerErrorResponse, ApiTags } from "@nestjs/swagger";
import { Controller, UseGuards, Get, Param, Put,Delete ,Body, Post, ParseUUIDPipe } from '@nestjs/common';
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/infraestructure/adapters/jwt/decorators/get-user.decorator";
import { Usuario } from "src/core/domain/entity/collections/usuario.collection";
import { CreateOpcionRequest, UpdateOpcionRequest } from "../model";
import { SistemaByIdQuery, SistemasAllQuery } from "src/core/application/feautures/Sistema/read";
import { CreateSistemaCommand, DeleteSistemaCommand, UpdateSistemaCommand } from "src/core/application/feautures/Sistema/write";
import { CreateSistemaRequest, UpdateSistemaRequest } from "../model/sistema";

@ApiTags('Sistema')
@Controller('/sistema')
export class SistemaController{

    constructor(
        private command: CommandBus,
        private query: QueryBus
    ) {}
    
    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Get('')
    async findAllSistemas() {
        return await this.query.execute(new SistemasAllQuery());
        
    }
    
    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Get(':id')
    async findOpcionById(@Param('id', ParseUUIDPipe) id:string) {
        return await this.query.execute(new SistemaByIdQuery(id));
        
    }

    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Post()
    async createSistema(@GetUser() usuario:Usuario,
                        @Body() createSistemaRequest:CreateSistemaRequest) {
        return await this.command.execute(new CreateSistemaCommand(createSistemaRequest, usuario));
        
    }


    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Put(':id')
    async updateSistema(@GetUser() usuario:Usuario,
                        @Param('id', ParseUUIDPipe) id:string,
                        @Body() updateSistemaRequest:UpdateSistemaRequest) {
        return await this.command.execute(new UpdateSistemaCommand(id,updateSistemaRequest, usuario));
        
    }

    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Delete(':id')
    async deleteSistema(@Param('id', ParseUUIDPipe) id:string) {
        return await this.command.execute(new DeleteSistemaCommand(id));
        
    }
   
}