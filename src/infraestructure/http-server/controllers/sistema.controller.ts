
import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { SistemaByIdQuery, SistemasAllQuery } from "src/core/application/feautures/Sistema/read";
import { CreateSistemaCommand, DeleteSistemaCommand, UpdateSistemaCommand } from "src/core/application/feautures/Sistema/write";
import { CreateSistemaRequest, UpdateSistemaRequest } from "../model/sistema";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class SistemaController{

    constructor(
        private command: CommandBus,
        private query: QueryBus
    ) {}
    
    @MessagePattern({cmd: 'findAll_sistemas'})
    async findAllSistemas() {
        return await this.query.execute(new SistemasAllQuery());
        
    }
    
    @MessagePattern({cmd: 'findOne_sistema'})
    async findSistemaById(id:string) {
        return await this.query.execute(new SistemaByIdQuery(id));
        
    }

    @MessagePattern({cmd: 'create_sistema'})
    async createSistema({usuario,...createSistemaRequest}:CreateSistemaRequest) {
        return await this.command.execute(new CreateSistemaCommand(createSistemaRequest, usuario));
        
    }


    @MessagePattern({cmd: 'update_sistema'})
    async updateSistema( {id, usuario,...updateSistemaRequest}:UpdateSistemaRequest) {
        return await this.command.execute(new UpdateSistemaCommand(id,updateSistemaRequest, usuario));
        
    }

    @MessagePattern({cmd: 'delete_sistema'})
    async deleteSistema({id,usuario}:any) {
        return await this.command.execute(new DeleteSistemaCommand(id,usuario));
        
    }
   
}