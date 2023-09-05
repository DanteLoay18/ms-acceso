import { ApiBearerAuth, ApiInternalServerErrorResponse, ApiTags } from "@nestjs/swagger";
import { Controller, UseGuards, Get, Param, Put,Delete ,Body, Post, ParseUUIDPipe } from '@nestjs/common';
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/infraestructure/adapters/jwt/decorators/get-user.decorator";
import { Usuario } from "src/core/domain/entity/collections/usuario.collection";
import { CreateMenuRequest, UpdateMenuRequest } from "../model";
import { MenuByIdQuery, MenusAllQuery } from "src/core/application/feautures/Menu/read";
import { CreateMenuCommand, DeleteMenuCommand, UpdateMenuCommand } from "src/core/application/feautures/Menu/write";

@ApiTags('Menu')
@Controller('/menu')
export class MenuController{

    constructor(
        private command: CommandBus,
        private query: QueryBus
    ) {}
    
    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Get('')
    async findAllMenus() {
        return await this.query.execute(new MenusAllQuery());
        
    }
    
    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Get(':id')
    async findMenuById(@Param('id', ParseUUIDPipe) id:string) {
        return await this.query.execute(new MenuByIdQuery(id));
        
    }

    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Post()
    async createMenu(@GetUser() usuario:Usuario,
                        @Body() createMenuRequest:CreateMenuRequest) {
        return await this.command.execute(new CreateMenuCommand(createMenuRequest, usuario));
        
    }


    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Put(':id')
    async updateMenu(@GetUser() usuario:Usuario,
                        @Param('id', ParseUUIDPipe) id:string,
                        @Body() updateMenuRequest:UpdateMenuRequest) {
        return await this.command.execute(new UpdateMenuCommand(id,updateMenuRequest, usuario));
        
    }

    @ApiInternalServerErrorResponse({ description: 'Error server'})
    @ApiBearerAuth() 
    @UseGuards(AuthGuard())
    @Delete(':id')
    async deleteMenu(@Param('id', ParseUUIDPipe) id:string) {
        return await this.command.execute(new DeleteMenuCommand(id));
        
    }
   
}