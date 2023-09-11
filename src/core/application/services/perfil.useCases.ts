import { BadRequestException, Injectable, NotFoundException,  } from "@nestjs/common";
import { CreatePerfilDto, UpdatePerfilDto, UsuarioDto } from "src/core/shared/dtos";
import { PerfilService } from "src/core/domain/services/perfil.service";
import { Perfil } from "src/core/domain/entity/collections";
import { MenuService, OpcionService, SistemaService } from "src/core/domain/services";
import {validate} from 'uuid'
import { error } from "console";
import { SistemasDto } from "src/core/domain/entity/sistemas.dto";
import { MenusDto } from "src/core/domain/entity/menus.dto";
import { Submenus } from "src/core/domain/entity/submenu.dto";
import { Opciones } from "src/core/domain/entity/opciones";

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
            return {
              error:404,
              message:`El perfil con el id ${id} no existe`
           }

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

    async createPerfil(createPerfilDto:CreatePerfilDto, usuarioDto:string){
        try {
            
          const perfilByTipoEncontrado= await this.findOneByTerm(createPerfilDto.tipo,"");
                
          if(perfilByTipoEncontrado?.['error'])
          return {
              error: perfilByTipoEncontrado['error'],
              message: perfilByTipoEncontrado['message']
              }

            const perfil = Perfil.createPerfil(createPerfilDto.tipo, usuarioDto);
           
            return this.perfilService.createPerfil(perfil);
            
       
        } catch (error) {
            this.handleExceptions(error);
        }
       
    }

    async updatePerfil(id:string, updatePerfilDto:UpdatePerfilDto, usuarioModificacion:string ){
        
      try {
          
          const perfilEncontrado = await this.getPerfilById(id);
          
          

          if(perfilEncontrado['error'])
          return {error: perfilEncontrado['error'], message: perfilEncontrado['message']}


          if(perfilEncontrado['esBloqueado'])
              return {
                      error: 400,
                      message: `Perfil se encuentra en modificacion`
                      }

          await this.bloquearPerfil(id, true);

          if(updatePerfilDto.tipo){
            const perfilByTipoEncontrado= await this.findOneByTerm(updatePerfilDto.tipo,id);
            if(perfilByTipoEncontrado?.['error'])
            return {
                error: perfilByTipoEncontrado['error'],
                message: perfilByTipoEncontrado['message']
            }
          }

          let sistemasDto:SistemasDto[]=[];

          if(updatePerfilDto.sistemas?.length > 0){
            
            const sistemasPromises = updatePerfilDto.sistemas.map(async ({ id, menus }) => {
                const sistemaEncontrado=await this.validarSistema(id);
                
                if(sistemaEncontrado?.['error']){
                  return sistemaEncontrado;
                }
                let menusDto:MenusDto[]=[];

                if (menus?.length > 0) {
                  const menusPromises = menus.map(async ({ id, submenus }) => {
                    const menuEncontrado=await this.validarMenu(id);
                    if(menuEncontrado?.['error']){
                      return menuEncontrado;
                    }

                    let submenusDto:Submenus[]=[];

                    if(submenus?.length > 0){
                      const submenusPromise = submenus.map( async({id, opciones})=>{
                        const submenuEncontrado=await this.validarSubMenu(id);
                        
                        if(submenuEncontrado?.['error']){
                          return submenuEncontrado;
                        }

                        let opcionesDto:Opciones[]=[];

                        if (opciones?.length > 0) {
                          const opcionesPromises = opciones.map(async ({id}) => {
                            const opcionEncontrada=await this.validarOpcion(id);
                           
                            if(opcionEncontrada?.['error']){
                              return opcionEncontrada;
                            }

                            const opcionDto=Perfil.createOpcionDto(id, opcionEncontrada);
                            opcionesDto.push(opcionDto);

                          });
            
                          const opcionesErrores = await Promise.all(opcionesPromises);
                          const errorOpciones=opcionesErrores.map(submenu => {
                                                          if(submenu?.['error']){
                                                            return submenu;
                                                          }
                                                      });
                          const errores= errorOpciones.filter(error => error?.['message']);
                          
                          if(errores.length>0)
                          return errores[0]
                        }

                        const submenuDto= Perfil.createSubmenuDto(id, submenuEncontrado,opcionesDto)
                        submenusDto.push(submenuDto)
                        
                      });
                      const submenusErrores = await Promise.all(submenusPromise);
                      const errorSubmenus=submenusErrores.map(submenu => {
                                                      if(submenu?.['error']){
                                                        return submenu;
                                                      }
                                                  });
                      const errores= errorSubmenus.filter(error => error?.['message']);
                      
                      if(errores.length>0)
                      return errores[0]
                    }

                    const menuDto= Perfil.createMenuDto(id,menuEncontrado,submenusDto)
                    menusDto.push(menuDto);
                    
                  });
        
                  
                  const menusErrores = await Promise.all(menusPromises);
                  const errorMenus=menusErrores.map(menu => {
                                                  if(menu?.['error']){
                                                    return menu;
                                                  }
                                              });
                  const errores= errorMenus.filter(error => error?.['message']);
                  
                  if(errores.length>0)
                  return errores[0]
                }
                

                const sistemaDto= Perfil.createSistemaDto(id,sistemaEncontrado, menusDto)
                  
                sistemasDto.push(sistemaDto);
              
                
              });
              const sistemas = await Promise.all(sistemasPromises);
              const errorSistemas=sistemas.map(sistema => {
                                               if(sistema?.['error']){
                                                return sistema;
                                              }
                                          });
              const errores= errorSistemas.filter(error => error?.['message']);
              
              if(errores.length>0)
              return errores[0]
             
          }


          const perfil = Perfil.updatePerfil(updatePerfilDto.tipo,sistemasDto,usuarioModificacion)
        
          return await this.perfilService.updatePerfil(id, perfil);

        }catch (error) {
            this.handleExceptions(error);
        }
        finally{
            await this.bloquearPerfil(id, false);
        }
       
    }

    async deletePerfil(id:string,usuarioModificacion:string){
        try {
          const perfilEncontrado = await this.getPerfilById(id);
            
          if(perfilEncontrado['error'])
          return {error: perfilEncontrado['error'], message: perfilEncontrado['message']}

          const perfil= Perfil.deletePerfil(usuarioModificacion);

          return await this.perfilService.deletePerfil(id, perfil);

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
        return {
            error:400,
            message:`El tipo ${term} ya esta registrado`
          };
        

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
          return {
            error:404,
            message:`Sistema con el Id ${sistemaId} no encontrado`
          };
        }
        return sistemaEncontrado;
      }
    
      async validarMenu(menuId: string) {
        if (!validate(menuId)) {
          return {
            error:400,
            message:`Menu con el Id ${menuId} no válido`
          };
        }
       
        const menuEncontrado = await this.menuService.findOneById(menuId);

        if (!menuEncontrado || menuEncontrado.esEliminado || menuEncontrado.esSubmenu) {
          return {
            error:400,
            message:`Menu con el Id ${menuId} no encontrado`
          };
        }

        return menuEncontrado;
      }
      async validarSubMenu(menuId: string) {
        if (!validate(menuId)) {
          return {
            error:400,
            message:`SunMenu con el Id ${menuId} no válido`
          };
        }
       
        const submenuEncontrado = await this.menuService.findOneById(menuId);

        if (!submenuEncontrado || submenuEncontrado.esEliminado || !submenuEncontrado.esSubmenu) {
          return {
            error:400,
            message:`Submenu con el Id ${menuId} no encontrado`
          };
        }

        return submenuEncontrado;
      }
      async validarOpcion(opcionId: string) {
        if (!validate(opcionId)) {
          return {
            error:400,
            message:`Opcion con el Id ${opcionId} no válido`
          };
        }
        const opcionEncontrado = await this.opcionService.findOneById(opcionId);
    
        if (!opcionEncontrado || opcionEncontrado.esEliminado) {
          return {
            error:400,
            message:`opcion con el Id ${opcionId} no encontrado`
          };
        }

        return opcionEncontrado;
      }
}