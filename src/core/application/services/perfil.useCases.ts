import { BadRequestException, Injectable, NotFoundException,  } from "@nestjs/common";
import { CreatePerfilDto, UpdatePerfilDto, UsuarioDto } from "src/core/shared/dtos";
import { PerfilService } from "src/core/domain/services/perfil.service";
import { Perfil } from "src/core/domain/entity/collections";


@Injectable()
export class PerfilUseCases{
    constructor(private readonly perfilService:PerfilService){}

    async getPerfilById(id:string){
        try{
            const perfil= await this.perfilService.findOneById(id);

            if(!perfil || perfil.esEliminado)
                throw new NotFoundException(`El perfil con el id ${id} no existe`);

            return perfil;

        }catch(error){
            this.handleExceptions(error)
        }
        
    }

    async getAllPerfiles(){
        
        try{
            return await this.perfilService.findAll();
        }catch(error){
            this.handleExceptions(error)
        }
       
    }

    async createPerfil(createPerfilDto:CreatePerfilDto, usuarioDto:UsuarioDto){
        try {
            
            await this.findOneByTerm(createPerfilDto.tipo)

            const perfil = Perfil.createPerfil(createPerfilDto.tipo, usuarioDto._id);
           
            return this.perfilService.createPerfil(perfil);
            
       
        } catch (error) {
            console.log(error)
            this.handleExceptions(error);
        }
       
    }

    async updatePerfil(id:string, updatePerfilDto:UpdatePerfilDto, usuarioModificacion:UsuarioDto ){
        
        try {
            
            const perfilEncontrado = await this.getPerfilById(id);
            
            if(perfilEncontrado.esBloqueado)
                throw new BadRequestException(`Perfil se encuentra en modificacion`)

            await this.bloquearPerfil(id, true);

            if(updatePerfilDto.tipo)
                await this.findOneByTerm(updatePerfilDto.tipo);

            

            const perfil = Perfil.updatePerfil(updatePerfilDto.tipo, updatePerfilDto.sistemas,usuarioModificacion._id)
            
            return await this.perfilService.updatePerfil(id, perfil);

        } catch (error) {
            this.handleExceptions(error);
        }
        finally{
            await this.bloquearPerfil(id, false);
        }
       
    }

    async deletePerfil(id:string){
        try {
            await this.getPerfilById(id);

            return await this.perfilService.deletePerfil(id);

        } catch (error) {
            this.handleExceptions(error);
        }
    }



    async bloquearPerfil(id:string, esBloqueado:boolean){
        try {
            return await this.perfilService.bloquearPerfil(id, esBloqueado);
        } catch (error) {
            this.handleExceptions(error)
        }
    }
    
    private async findOneByTerm(term:string){

        let perfil= await this.perfilService.findOneByTipo(term.toUpperCase());
            
        if(perfil)
            throw new BadRequestException(`El tipo ${term} ya esta registrado`)
        

        return perfil;

        
    }

    private handleExceptions(error:any){
        
        if(error.code==="23505")
        throw new BadRequestException(error.detail)
        
        

        throw new BadRequestException(error.message)
      }
}