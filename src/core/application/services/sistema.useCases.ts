import { BadRequestException, Injectable, NotFoundException,  } from "@nestjs/common";
import { Sistema } from "src/core/domain/entity/collections";
import { SistemaService } from "src/core/domain/services/sistema.service";
import { CreateSistemaDto, UpdateSistemaDto, UsuarioDto } from "src/core/shared/dtos";



@Injectable()
export class SistemaUseCases{
    constructor(private readonly sistemaService:SistemaService){}

    async getSistemaById(id:string){
        try{
            const Sistema= await this.sistemaService.findOneById(id);

            if(!Sistema || Sistema.esEliminado)
                throw new NotFoundException(`El sistema con el id ${id} no existe`)

            return Sistema;

        }catch(error){
            this.handleExceptions(error)
        }
        
    }

    async getAllSistemas(){
        
        try{
            return await this.sistemaService.findAll();
        }catch(error){
            this.handleExceptions(error)
        }
       
    }

    async createSistema(createSistemaDto:CreateSistemaDto, usuarioDto:UsuarioDto){
        try {
            
            await this.findOneByTerm(createSistemaDto.nombre,"")

            const sistema = Sistema.createSistema(createSistemaDto.nombre, createSistemaDto.url, createSistemaDto.imagen, createSistemaDto.puerto, usuarioDto._id);
           
            return this.sistemaService.createSistema(sistema);
            
       
        } catch (error) {
            console.log(error)
            this.handleExceptions(error);
        }
       
    }

    async updateSistema(id:string, updateSistemaDto:UpdateSistemaDto, usuarioModificacion:UsuarioDto ){
        
        try {
            
            const SistemaEncontrado = await this.getSistemaById(id);
            
            if(SistemaEncontrado.esBloqueado)
                throw new BadRequestException(`Sistema se encuentra en modificacion`)

            await this.bloquearSistema(id, true);

            if(updateSistemaDto.nombre)
            await this.findOneByTerm(updateSistemaDto.nombre,id)

            const sistema = Sistema.updateSistema(updateSistemaDto.nombre,updateSistemaDto.url,updateSistemaDto.imagen,updateSistemaDto.puerto,usuarioModificacion._id)
            
            return await this.sistemaService.updateSistema(id, sistema);

        } catch (error) {
            this.handleExceptions(error);
        }
        finally{
            await this.bloquearSistema(id, false);
        }
       
    }

    async deleteSistema(id:string){
        try {
            await this.getSistemaById(id);

            return await this.sistemaService.deleteSistema(id);

        } catch (error) {
            this.handleExceptions(error);
        }
    }



    async bloquearSistema(id:string, esBloqueado:boolean){
        try {
            return await this.sistemaService.bloquearSistema(id, esBloqueado);
        } catch (error) {
            this.handleExceptions(error)
        }
    }
    
    private async findOneByTerm(term:string,id:string){

        let sistema= await this.sistemaService.findOneByNombre(term.toUpperCase());

       
        if(sistema && sistema._id!==id)
            throw new BadRequestException(`El nombre ${term} ya esta registrado`)
       
        return sistema;

        
    }

    private handleExceptions(error:any){
        
        if(error.code==="23505")
        throw new BadRequestException(error.detail)
        
        

        throw new BadRequestException(error.message)
      }
}