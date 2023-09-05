import { BadRequestException, Injectable, NotFoundException,  } from "@nestjs/common";
import { UsuarioDto } from "src/core/shared/dtos/usuario.dto";
import { OpcionService } from "src/core/domain/services/opcion.service";
import { UpdateOpcionDto } from "src/core/shared/dtos/update-opcion.dto";
import { Opcion } from "src/core/domain/entity/collections/opcion.collection";
import { CreateOpcionDto } from "src/core/shared/dtos";


@Injectable()
export class OpcionUseCases{
    constructor(private readonly opcionService:OpcionService){}

    async getOpcionById(id:string){
        try{
            const opcion= await this.opcionService.findOneById(id);

            if(!opcion || opcion.esEliminado)
                throw new NotFoundException(`El usuario con el id ${id} no existe`)

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

    async createOpcion(createOpcionDto:CreateOpcionDto, usuarioDto:UsuarioDto){
        try {
            
            await this.findOneByTerm(createOpcionDto.nombre)
            await this.findOneByTerm(createOpcionDto.icono)

            const opcion = Opcion.createOpcion(createOpcionDto.nombre, createOpcionDto.icono, createOpcionDto.tieneOpciones, createOpcionDto.esEmergente, usuarioDto._id);
           
            return this.opcionService.createOpcion(opcion);
            
       
        } catch (error) {
            console.log(error)
            this.handleExceptions(error);
        }
       
    }

    async updateOpcion(id:string, updateOpcionDto:UpdateOpcionDto, usuarioModificacion:UsuarioDto ){
        
        try {
            
            const opcionEncontrado = await this.getOpcionById(id);
            
            if(opcionEncontrado.esBloqueado)
                throw new BadRequestException(`Usuario se encuentra en modificacion`)

            await this.bloquearOpcion(id, true);

            const opcion = Opcion.updateOpcion(updateOpcionDto.nombre,updateOpcionDto.icono,updateOpcionDto.tieneOpciones,updateOpcionDto.esEmergente,usuarioModificacion._id)
            
            return await this.opcionService.updateOpcion(id, opcion);

        } catch (error) {
            this.handleExceptions(error);
        }
        finally{
            await this.bloquearOpcion(id, false);
        }
       
    }

    async deleteOpcion(id:string){
        try {
            await this.getOpcionById(id);

            return await this.opcionService.deleteOpcion(id);

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
    
    private async findOneByTerm(term:string){

        let opcion= await this.opcionService.findOneByNombre(term.toUpperCase());

       
        if(!opcion){
            opcion= await this.opcionService.findOneByIcono(term.toUpperCase());
        }else{
            throw new BadRequestException(`El nombre ${term} ya esta registrado`)
        }
            
        if(opcion)
            throw new BadRequestException(`El icono ${term} ya esta registrado`)
        

        return opcion;

        
    }

    private handleExceptions(error:any){
        
        if(error.code==="23505")
        throw new BadRequestException(error.detail)
        
        

        throw new BadRequestException(error.message)
      }
}