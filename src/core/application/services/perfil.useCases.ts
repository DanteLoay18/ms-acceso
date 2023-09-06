import { BadRequestException, Injectable, NotFoundException,  } from "@nestjs/common";
import { CreatePerfilDto, UpdatePerfilDto, UsuarioDto } from "src/core/shared/dtos";
import { PerfilService } from "src/core/domain/services/perfil.service";
import { Perfil } from "src/core/domain/entity/collections";
import { MenuService, OpcionService, SistemaService } from "src/core/domain/services";
import {validate} from 'uuid'

@Injectable()
export class PerfilUseCases{
    constructor(private readonly perfilService:PerfilService,
                private readonly sistemaService:SistemaService,
                private readonly opcionService:OpcionService,
                private readonly menuService:MenuService,){}

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
            
            await this.findOneByTerm(createPerfilDto.tipo,"")

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
              await this.findOneByTerm(updatePerfilDto.tipo,id);

          if(updatePerfilDto.sistemas?.length > 0){
             
            const sistemasPromises = updatePerfilDto.sistemas.map(async ({ sistema, menus }) => {
                await this.validarSistema(sistema);
        
                if (menus?.length > 0) {
                  const menusPromises = menus.map(async ({ menu, opciones }) => {
                    await this.validarMenu(menu);
        
                    if (opciones?.length > 0) {
                      const opcionesPromises = opciones.map(async (opcion) => {
                        await this.validarOpcion(opcion);
                      });
        
                      await Promise.all(opcionesPromises);
                    }
                  });
        
                  await Promise.all(menusPromises);
                }
              });
        
              await Promise.all(sistemasPromises);
              
          }

          const perfil = Perfil.updatePerfil(updatePerfilDto.tipo,updatePerfilDto.sistemas,usuarioModificacion._id)
        
          return await this.perfilService.updatePerfil(id, perfil);

        }catch (error) {
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
    
    private async findOneByTerm(term:string,id:string){

        let perfil= await this.perfilService.findOneByTipo(term.toUpperCase());
            
        if(perfil && perfil._id!==id)
            throw new BadRequestException(`El tipo ${term} ya esta registrado`)
        

        return perfil;

        
    }

    private handleExceptions(error:any){
        
        if(error.code==="23505")
        throw new BadRequestException(error.detail)
        
        

        throw new BadRequestException(error.message)
      }

      async validarSistema(sistemaId: string) {
        const sistemaEncontrado = await this.sistemaService.findOneById(sistemaId);
    
        if (!sistemaEncontrado || sistemaEncontrado.esEliminado) {
          throw new NotFoundException(`Sistema con el Id ${sistemaId} no encontrado`);
        }
      }
    
      async validarMenu(menuId: string) {
        if (!validate(menuId)) {
          throw new NotFoundException(`Menu con el Id ${menuId} no válido`);
        }
       
        const menuEncontrado = await this.menuService.findOneById(menuId);

        if (!menuEncontrado || menuEncontrado.esEliminado || menuEncontrado.esSubmenu) {
          throw new NotFoundException(`Menu con el Id ${menuId} no encontrado`);
        }
      }
    
      async validarOpcion(opcionId: string) {
        if (!validate(opcionId)) {
          throw new NotFoundException(`Opcion con el Id ${opcionId} no válido`);
        }
        const opcionEncontrado = await this.opcionService.findOneById(opcionId);
    
        if (!opcionEncontrado || opcionEncontrado.esEliminado) {
          throw new NotFoundException(`Opcion con el Id ${opcionId} no encontrado`);
        }
      }
}