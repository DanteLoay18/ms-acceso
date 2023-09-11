import { BadRequestException, Injectable,  } from "@nestjs/common";
import { OpcionService } from "src/core/domain/services/opcion.service";
import { Opcion } from "src/core/domain/entity/collections/opcion.collection";
import { CreateOpcionDto, UpdateOpcionDto } from "src/core/shared/dtos";


@Injectable()
export class OpcionUseCases{
    constructor(private readonly opcionService:OpcionService){}

    async getOpcionById(id:string){
        try{
            const opcion= await this.opcionService.findOneById(id);

            if(!opcion || opcion.esEliminado)
            return {error: 404, message: `La opcion con el id ${id} no existe`}

            return opcion;

        }catch(error){
            this.handleExceptions(error)
        }
        
    }

    async getAllOpciones(){
        
        try{
            return await this.opcionService.findAll();
        }catch(error){
            this.handleExceptions(error)
        }
       
    }

    async createOpcion(createOpcionDto:CreateOpcionDto, usuarioDto:string){
        try {
            
            const opcionByNombreEncontrado= await this.findOneByTerm(createOpcionDto.nombre,"");
                
            if(opcionByNombreEncontrado?.['error'])
            return {
                error: opcionByNombreEncontrado['error'],
                message: opcionByNombreEncontrado['message']
                }


            const opcionByIconoEncontrado= await this.findOneByTerm(createOpcionDto.icono,"");

                if(opcionByIconoEncontrado?.['error'])
                return {
                    error: opcionByIconoEncontrado['error'],
                    message: opcionByIconoEncontrado['message']
                    }

            const opcion = Opcion.createOpcion(createOpcionDto.nombre, createOpcionDto.icono, createOpcionDto.tieneOpciones, createOpcionDto.esEmergente, usuarioDto);
           
            return this.opcionService.createOpcion(opcion);
            
       
        } catch (error) {
            this.handleExceptions(error);
        }
       
    }

    async updateOpcion(id:string, updateOpcionDto:UpdateOpcionDto, usuarioModificacion:string ){
        
        try {
            
            const opcionEncontrado = await this.getOpcionById(id);
            
            if(opcionEncontrado['error'])
            return {error: opcionEncontrado['error'], message: opcionEncontrado['message']}


            if(opcionEncontrado['esBloqueado'])
                return {
                        error: 400,
                        message: `Opcion se encuentra en modificacion`
                        }
    

            await this.bloquearOpcion(id, true);
           
            if(updateOpcionDto.nombre){
                const opcionByNombreEncontrado= await this.findOneByTerm(updateOpcionDto.nombre,id);
                
                if(opcionByNombreEncontrado?.['error'])
                return {
                    error: opcionByNombreEncontrado['error'],
                    message: opcionByNombreEncontrado['message']
                    }
            }
            

            if(updateOpcionDto.icono){
                const opcionByIconoEncontrado= await this.findOneByTerm(updateOpcionDto.icono,id);

                if(opcionByIconoEncontrado?.['error'])
                return {
                    error: opcionByIconoEncontrado['error'],
                    message: opcionByIconoEncontrado['message']
                    }
            }
        
            const opcion = Opcion.updateOpcion(updateOpcionDto.nombre,updateOpcionDto.icono,updateOpcionDto.tieneOpciones,updateOpcionDto.esEmergente,usuarioModificacion)
            
            return await this.opcionService.updateOpcion(id, opcion);

        } catch (error) {
            this.handleExceptions(error);
        }
        finally{
            await this.bloquearOpcion(id, false);
        }
       
    }

    async deleteOpcion(id:string, usuarioModificacion:string){
        try {
            const opcionEncontrado = await this.getOpcionById(id);
            
            if(opcionEncontrado['error'])
            return {error: opcionEncontrado['error'], message: opcionEncontrado['message']}

            const opcion = Opcion.deleteOpcion(usuarioModificacion)
            return await this.opcionService.deleteOpcion(id, opcion);

        } catch (error) {
            this.handleExceptions(error);
        }
    }



    async bloquearOpcion(id:string, esBloqueado:boolean){
        try {
            return await this.opcionService.bloquearOpcion(id, esBloqueado);
        } catch (error) {
            this.handleExceptions(error)
        }
    }
    
    private async findOneByTerm(term:string, id:string){

        let opcion= await this.opcionService.findOneByNombre(term.toUpperCase());

       
        if(opcion && opcion._id !==id){
            return {
                error: 400,
                message: `El nombre ${term} ya esta registrado`
            }    
        }else{
            opcion= await this.opcionService.findOneByIcono(term.toUpperCase());
        }
            
        if(opcion && opcion._id !==id)
        return {
            error: 400,
            message: `El icono ${term} ya esta registrado`
        }    

        return opcion;

        
    }

    private handleExceptions(error:any){
        
        if(error.code==="23505")
        throw new BadRequestException(error.detail)
        
        

        throw new BadRequestException(error.message)
      }
}