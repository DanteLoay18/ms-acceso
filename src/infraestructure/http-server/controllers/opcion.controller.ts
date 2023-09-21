
import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { OpcionByIdQuery, OpcionesAllQuery } from "src/core/application/feautures/Opcion/read";
import { CreateOpcionCommand, DeleteOpcionCommand, UpdateOpcionCommand } from "src/core/application/feautures/Opcion/write";
import { CreateOpcionRequest, UpdateOpcionRequest } from "../model";
import { MessagePattern } from '@nestjs/microservices';
import { OpcionesPaginado } from '../model/opcion/opcionesPaginado.request';
import { BuscarOpcionesRequest } from '../model/opcion/buscar-opcion.request';
import { OpcionByBusquedaQuery } from 'src/core/application/feautures/Opcion/read/opcionByBusqueda';

@Controller()
export class OpcionController{

    constructor(
        private command: CommandBus,
        private query: QueryBus
    ) {}
    
    @MessagePattern({cmd: 'findAll_opciones'})
    async findAllOpciones(opcionesPaginado:OpcionesPaginado) {
        return await this.query.execute(new OpcionesAllQuery(opcionesPaginado.page, opcionesPaginado.pageSize));
        
    }
    
    @MessagePattern({cmd: 'findOne_opcion'})
    async findOpcionById(id:string) {
        return await this.query.execute(new OpcionByIdQuery(id));
        
    }

    @MessagePattern({cmd: 'findByBusqueda_opcion'})
    async findOpcionByBusqueda(buscarOpcionRquest:BuscarOpcionesRequest) {
        return await this.query.execute(new OpcionByBusquedaQuery(buscarOpcionRquest));

        
    }

    @MessagePattern({cmd: 'create_opcion'})
    async createOpcion({usuario, ...createOpcionRequest}:CreateOpcionRequest) {
       
        return await this.command.execute(new CreateOpcionCommand(createOpcionRequest,usuario));
        

    }


    @MessagePattern({cmd: 'update_opcion'})
    async updateOpcion({id, usuario, ...updateOpcionRequest}:UpdateOpcionRequest) {
        return await this.command.execute(new UpdateOpcionCommand(id,updateOpcionRequest, usuario));
    }    
        

    @MessagePattern({cmd: 'delete_opcion'})
    async deleteOpcion({id,usuario}:any) {
        return await this.command.execute(new DeleteOpcionCommand(id,usuario));
        
    }
   
}