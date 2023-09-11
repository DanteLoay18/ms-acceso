import { BadRequestException, Injectable, NotFoundException,  } from "@nestjs/common";
import { Menu, Perfil } from "src/core/domain/entity/collections";
import { MenuService, OpcionService, SistemaService } from "src/core/domain/services";
import { PerfilService } from "src/core/domain/services/perfil.service";
import { CreateMenuDto, UpdateMenuDto } from "src/core/shared/dtos";

@Injectable()
export class MenuUseCases{
    constructor(
                private readonly menuService:MenuService,
                private readonly sistemaService:SistemaService,
                private readonly opcionService:OpcionService,
                private readonly perfilService:PerfilService,
                ){}

    async getMenuById(id:string){
        try{
            const menu= await this.menuService.findOneById(id);

            if(!menu || menu.esEliminado)
            return {error: 404, message: `El menu con el id ${id} no existe`}

            return menu;

        }catch(error){
            this.handleExceptions(error)
        }
        
    }

    async getAllMenus(){
        
        try{
            return await this.menuService.findAll();
        }catch(error){
            this.handleExceptions(error)
        }
       
    }

    async createMenu(createMenuDto:CreateMenuDto, usuarioDto:string){
        try {
            
            const menuByNombreEncontrado= await this.findOneByTerm(createMenuDto.nombre,"");
                
            if(menuByNombreEncontrado?.['error'] )
            return {
                error: menuByNombreEncontrado['error'],
                message: menuByNombreEncontrado['message']
                }
            

            const menu = Menu.createMenu(createMenuDto.nombre, createMenuDto.esSubmenu, usuarioDto);
           
            return this.menuService.createMenu(menu);
            
       
        } catch (error) {
            this.handleExceptions(error);
        }
       
    }

    async updateMenu(id:string, updateMenuDto:UpdateMenuDto, usuarioModificacion:string ){
        
        try {
            
            const menuEncontrado = await this.getMenuById(id);
            
            if(menuEncontrado['error'])
            return {error: menuEncontrado['error'], message: menuEncontrado['message']}


            if(menuEncontrado['esBloqueado'])
                return {
                        error: 400,
                        message: `Opcion se encuentra en modificacion`
                        }

            await this.bloquearMenu(id, true);
            
            if(updateMenuDto.nombre){
                const menuByNombreEncontrado= await this.findOneByTerm(updateMenuDto.nombre,id);
                if(menuByNombreEncontrado?.['error'])
                return {
                    error: menuByNombreEncontrado['error'],
                    message: menuByNombreEncontrado['message']
                    }
            }

            if(updateMenuDto.sistema){
                const sistema= await this.sistemaService.findOneById(updateMenuDto.sistema);

                if(!sistema || sistema.esEliminado)
                return {
                        error:400,
                        message:`El sistema con el id ${updateMenuDto.sistema} no existe`
                }
            }
            
            if(updateMenuDto.opciones?.length > 0 && !menuEncontrado['esSubmenu'])
            return {
                error:400,
                message:"El menu no puede tener opciones ya que no es un submenu"
            }

            if (updateMenuDto.opciones?.length > 0 || updateMenuDto.opciones) {
                const opcionesPromises = updateMenuDto.opciones.map(async (opcionId) => {
                  const opcion = await this.opcionService.findOneById(opcionId);
                 
                  if(!opcion || opcion.esEliminado){
                    return {opcionId, valido:false}
                  }
                 
                  return { opcionId, valido: true };
                });
              
                const opcionesResultados = await Promise.all(opcionesPromises);
              
                
                const opcionesInvalidas = opcionesResultados.filter((resultado) => !resultado.valido);
              
                
                if (opcionesInvalidas.length > 0) {
                    return {
                        error:404,
                        message:`Opcion con el Id ${opcionesInvalidas[0].opcionId} no encontrado`
                    }
                  
                  
                }
              }

            if (updateMenuDto.submenus?.length > 0 || updateMenuDto.submenus) {
                const menusPromises = updateMenuDto.submenus.map(async (submenuId) => {
                  const menu = await this.menuService.findOneById(submenuId);
                 
                  if(!menu || menu.esEliminado || !menu.esSubmenu ){
                    return {submenuId, valido:false}
                  }
                 
                  return { submenuId, valido: true };
                });
              
                const menusResultados = await Promise.all(menusPromises);
              
                
                const menusInvalidos = menusResultados.filter((resultado) => !resultado.valido);
              
                
                if (menusInvalidos.length > 0) 
                return {
                    error:404,
                    message:`Submenu con el Id ${menusInvalidos[0].submenuId} no esta registrado o no es un submenu valido`
                }
                 

                
              }  

            
            const menu = Menu.updateMenu(updateMenuDto.nombre,updateMenuDto.esSubmenu,updateMenuDto.sistema,updateMenuDto.submenus,updateMenuDto.opciones,usuarioModificacion)
            
            if(!menuEncontrado?.['esSubmenu']){
                const perfiles=await this.perfilService.findAll();
            
                const perfilesFiltrados = perfiles.filter(perfil => {
                    return perfil.sistemas.some(sistema => {
                    return sistema.menus.some(menu => {
                        return menu.id === id && sistema.esEliminado === false;
                    });
                    });
                });
                
                perfilesFiltrados.forEach(async (perfil) => {
                    const perfilEntity= Perfil.updatePerfil(perfil.tipo, perfil.sistemas, usuarioModificacion);

                    perfilEntity.sistemas=perfilEntity.sistemas.map(sistemaEncontrado=> {
                        const menus= sistemaEncontrado.menus.map(menuEncontrado => {
                                        if(menuEncontrado.id===id){
                                            return {
                                                id:menuEncontrado.id,
                                                nombre:menu.nombre || menuEncontrado.nombre,
                                                esSubmenu: menu.esSubmenu || menuEncontrado.esSubmenu,
                                                esEliminado:menuEncontrado.esEliminado,
                                                submenus:menuEncontrado.submenus
                                            }
                                        }
                                    })

                        return {
                            ...sistemaEncontrado,
                            menus
                        }
                    })
                    await this.perfilService.updatePerfil(perfil._id,perfilEntity)
                })
            }else{

                const perfiles=await this.perfilService.findAll();
            
                const perfilesFiltrados = perfiles.filter(perfil => {
                    return perfil.sistemas.some(sistema => {
                        return sistema.menus.some(menu => {
                        return menu.submenus.some(submenu => {
                            return submenu.id === id && menu.esEliminado === false;
                        });
                        });
                    });
                });
                
                perfilesFiltrados.forEach(async (perfil) => {
                    const perfilEntity= Perfil.updatePerfil(perfil.tipo, perfil.sistemas, usuarioModificacion);

                    perfilEntity.sistemas=perfilEntity.sistemas.map(sistemaEncontrado=> {
                        const menus= sistemaEncontrado.menus.map(menuEncontrado => {
                                        const submenus= menuEncontrado.submenus.map(submenuEncontrado=> {
                                            if(submenuEncontrado.id===id){
                                                return {
                                                    id:submenuEncontrado.id,
                                                    nombre:menu.nombre || submenuEncontrado.nombre,
                                                    esSubmenu: menu.esSubmenu || submenuEncontrado.esSubmenu,
                                                    esEliminado:submenuEncontrado.esEliminado,
                                                    opciones:submenuEncontrado.opciones
                                                }
                                            }
                                        })
                                        return {
                                            ...menuEncontrado,
                                            submenus
                                        }
                                    })

                        return {
                            ...sistemaEncontrado,
                            menus
                        }
                    })
                    await this.perfilService.updatePerfil(perfil._id,perfilEntity)
                })
            }
            

            return await this.menuService.updateMenu(id, menu);

        } catch (error) {
            this.handleExceptions(error);
        }
        finally{
            await this.bloquearMenu(id, false);
        }
       
    }

    async deleteMenu(id:string,usuarioModificacion:string){
        try {
            const menuEncontrado = await this.getMenuById(id);
            
            if(menuEncontrado['error'])
            return {error: menuEncontrado['error'], message: menuEncontrado['message']}
            

            const menu= Menu.deleteMenu(usuarioModificacion)

            if(!menuEncontrado?.['esSubmenu']){
                const perfiles=await this.perfilService.findAll();
            
                const perfilesFiltrados = perfiles.filter(perfil => {
                    return perfil.sistemas.some(sistema => {
                    return sistema.menus.some(menu => {
                        return menu.id === id && sistema.esEliminado === false;
                    });
                    });
                });
                
                perfilesFiltrados.forEach(async (perfil) => {
                    const perfilEntity= Perfil.updatePerfil(perfil.tipo, perfil.sistemas, usuarioModificacion);

                    perfilEntity.sistemas=perfilEntity.sistemas.map(sistemaEncontrado=> {
                        const menus= sistemaEncontrado.menus.map(menuEncontrado => {
                                        if(menuEncontrado.id===id){
                                            return {
                                                ...menuEncontrado,
                                                esEliminado:true
                                            }
                                        }
                                    })

                        return {
                            ...sistemaEncontrado,
                            menus
                        }
                    })
                    await this.perfilService.updatePerfil(perfil._id,perfilEntity)
                })
            }else{

                const perfiles=await this.perfilService.findAll();
            
                const perfilesFiltrados = perfiles.filter(perfil => {
                    return perfil.sistemas.some(sistema => {
                        return sistema.menus.some(menu => {
                        return menu.submenus.some(submenu => {
                            return submenu.id === id && menu.esEliminado === false;
                        });
                        });
                    });
                });
                
                perfilesFiltrados.forEach(async (perfil) => {
                    const perfilEntity= Perfil.updatePerfil(perfil.tipo, perfil.sistemas, usuarioModificacion);

                    perfilEntity.sistemas=perfilEntity.sistemas.map(sistemaEncontrado=> {
                        const menus= sistemaEncontrado.menus.map(menuEncontrado => {
                                        const submenus= menuEncontrado.submenus.map(submenuEncontrado=> {
                                            if(submenuEncontrado.id===id){
                                                return {
                                                    ...submenuEncontrado,
                                                    esEliminado:true
                                                }
                                            }
                                        })
                                        return {
                                            ...menuEncontrado,
                                            submenus
                                        }
                                    })

                        return {
                            ...sistemaEncontrado,
                            menus
                        }
                    })
                    await this.perfilService.updatePerfil(perfil._id,perfilEntity)
                })
            }

            return await this.menuService.deleteMenu(id,menu);

        } catch (error) {
            this.handleExceptions(error);
        }
    }



    async bloquearMenu(id:string, esBloqueado:boolean){
        try {
            return await this.menuService.bloquearMenu(id, esBloqueado);
        } catch (error) {
            this.handleExceptions(error)
        }
    }
    
    private async findOneByTerm(term:string, id:string){

        let menu= await this.menuService.findOneByNombre(term.toUpperCase());
            
        if(menu && menu._id !== id)
        return {
                error:400,
                message:`El nombre ${term} ya esta registrado`
            }
        

        return menu;

        
    }

    private handleExceptions(error:any){
        
        if(error.code==="23505")
        throw new BadRequestException(error.detail)
        
        

        throw new BadRequestException(error.message)
      }
}