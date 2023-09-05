import { ApiBearerAuth, ApiInternalServerErrorResponse, ApiTags } from "@nestjs/swagger";
import { Controller, UseGuards, Get, Param, Put,Delete ,Body, Post, ParseUUIDPipe } from '@nestjs/common';
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/infraestructure/adapters/jwt/decorators/get-user.decorator";
import { Usuario } from "src/core/domain/entity/collections/usuario.collection";
import { OpcionByIdQuery, OpcionesAllQuery } from "src/core/application/feautures/Opcion/read";
import { CreateOpcionCommand, DeleteOpcionCommand, UpdateOpcionCommand } from "src/core/application/feautures/Opcion/write";
import { CreateOpcionRequest, UpdateOpcionRequest } from "../model";

@ApiTags('Opcion')
@Controller('/opcion')
export class OpcionController{

    constructor(
        private command: CommandBus,
        private query: QueryBus
    ) {}
    
    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Get('')
    async findAllOpciones() {
        return await this.query.execute(new OpcionesAllQuery());
        
    }
    
    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Get(':id')
    async findOpcionById(@Param('id', ParseUUIDPipe) id:string) {
        return await this.query.execute(new OpcionByIdQuery(id));
        
    }

    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Post()
    async createOpcion(@GetUser() usuario:Usuario,
                        @Body() createOpcionRequest:CreateOpcionRequest) {
        return await this.command.execute(new CreateOpcionCommand(createOpcionRequest, usuario));
        
    }


    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Put(':id')
    async updateOpcion(@GetUser() usuario:Usuario,
                        @Param('id', ParseUUIDPipe) id:string,
                        @Body() updateOpcionRequest:UpdateOpcionRequest) {
        return await this.command.execute(new UpdateOpcionCommand(id,updateOpcionRequest, usuario));
        
    }

    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Delete(':id')
    async deleteOpcion(@Param('id', ParseUUIDPipe) id:string) {
        return await this.command.execute(new DeleteOpcionCommand(id));
        
    }
   
}