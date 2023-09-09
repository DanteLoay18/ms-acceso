
import { Controller} from '@nestjs/common';
import { CommandBus, QueryBus } from "@nestjs/cqrs";

import { PerfilByIdQuery, PerfilesAllQuery } from "src/core/application/feautures/Perfil/read";
import { CreatePerfilCommand, DeletePerfilCommand, UpdatePerfilCommand } from "src/core/application/feautures/Perfil/write";
import { CreatePerfilRequest, UpdatePerfilRequest } from "../model";
import { MessagePattern } from '@nestjs/microservices';


@Controller()
export class PerfilController{

    constructor(
        private command: CommandBus,
        private query: QueryBus
    ) {}
    
    @MessagePattern({cmd: 'findAll_perfiles'})
    async findAllPerfils() {
        return await this.query.execute(new PerfilesAllQuery());
        
    }
    
    @MessagePattern({cmd: 'findOne_perfil'})
    async findPerfilById(id:string) {
        return await this.query.execute(new PerfilByIdQuery(id));
        
    }

    @MessagePattern({cmd: 'create_perfil'})
    async createPerfil({usuario,...createPerfilRequest}:CreatePerfilRequest) {
        return await this.command.execute(new CreatePerfilCommand(createPerfilRequest, usuario));
        
    }


    @MessagePattern({cmd: 'update_perfil'})
    async updatePerfil({id,usuario,...updatePerfilRequest}:UpdatePerfilRequest) {
        return await this.command.execute(new UpdatePerfilCommand(id,updatePerfilRequest, usuario));
        
    }

    @MessagePattern({cmd: 'delete_perfil'})
    async deletePerfil({id,usuario}:any) {
        return await this.command.execute(new DeletePerfilCommand(id,usuario));
        
    }
   
}