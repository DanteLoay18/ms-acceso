
import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { SistemaByIdQuery, SistemasAllQuery } from "src/core/application/feautures/Sistema/read";
import { CreateSistemaCommand, DeleteSistemaCommand, UpdateSistemaCommand } from "src/core/application/feautures/Sistema/write";
import { CreateSistemaRequest, UpdateSistemaRequest } from "../model/sistema";
import { MessagePattern } from "@nestjs/microservices";
import { SistemasPaginado } from '../model/sistema/sistemas-paginado.request';
import { BuscarSistemasRequest } from '../model/sistema/buscar-sistema.request';
import { SistemaByBusquedaQuery } from 'src/core/application/feautures/Sistema/read/sistemaByBusqueda';

@Controller()
export class SistemaController{

    constructor(
        private command: CommandBus,
        private query: QueryBus
    ) {}
    
    @MessagePattern({cmd: 'findAll_sistemas'})
    async findAllSistemas(sistemasPaginado:SistemasPaginado) {
        return await this.query.execute(new SistemasAllQuery(sistemasPaginado.page, sistemasPaginado.pageSize));
        
    }
    
    @MessagePattern({cmd: 'findOne_sistema'})
    async findSistemaById(id:string) {
        return await this.query.execute(new SistemaByIdQuery(id));
        
    }

    @MessagePattern({cmd: 'findByBusqueda_sistema'})
    async findSistemaByBusqueda(buscarSistemaRquest:BuscarSistemasRequest) {
        return await this.query.execute(new SistemaByBusquedaQuery(buscarSistemaRquest));

        
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