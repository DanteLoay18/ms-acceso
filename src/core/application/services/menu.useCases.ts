import { BadRequestException, Injectable,  } from "@nestjs/common";
import { Menu, Perfil } from "src/core/domain/entity/collections";
import { MenuService, OpcionService, SistemaService } from "src/core/domain/services";
import { PerfilService } from "src/core/domain/services/perfil.service";
import { CreateMenuDto, CreateSubmenuDto, UpdateMenuDto } from "src/core/shared/dtos";
import { MenuPaginadoDto } from "src/core/shared/dtos/menu/menu-paginado.dto";
import { Paginated } from "../utils/Paginated";
import { MenuBusquedaDto } from "src/core/shared/dtos/menu/menu-busqueda.dto";
import { SubmenuByMenuPaginadoDto } from "src/core/shared/dtos/menu/submenu-menu-busqueda.dto";

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

    async getAllMenus(menuPaginadoDto:MenuPaginadoDto){
        
        try{
            const offset = (menuPaginadoDto.page - 1 )*menuPaginadoDto.pageSize;
            const menus = await this.menuService.getMenusSlice(menuPaginadoDto.pageSize, offset, menuPaginadoDto.esSubmenu)
            const total = await this.menuService.getMenusCount(menuPaginadoDto.esSubmenu);

            if(menus.length === 0 && menuPaginadoDto.page !==1){
                const offset = (menuPaginadoDto.page - 2 )*menuPaginadoDto.pageSize;
                const menus = await this.menuService.getMenusSlice(menuPaginadoDto.pageSize, offset,menuPaginadoDto.esSubmenu);
                return {
                    page:menuPaginadoDto.page-1,
                    pageSize:menuPaginadoDto.pageSize,
                    items: menus,
                    total: total
                }
            }
            return Paginated.create({
                ...menuPaginadoDto,
                items: menus,
                total: total
            });

        }catch(error){
            this.handleExceptions(error)
        }
       
    }

    async getSubmenusByMenu(submenuByMenuPaginadoDto:SubmenuByMenuPaginadoDto) :Promise<Paginated<string>>{
        
        try{

            const startIndex = (submenuByMenuPaginadoDto.page - 1 )*submenuByMenuPaginadoDto.pageSize;
            const endIndex = startIndex + submenuByMenuPaginadoDto.pageSize;
            let {submenus} =  await this.menuService.getSubmenusByMenuSlice(submenuByMenuPaginadoDto.id,submenuByMenuPaginadoDto.esSubmenu)

            if(submenus===undefined){
                return {
                    page:1,
                    pageSize:10,
                    items: [],
                    total: 0
                }
            }
            
            submenus =submenus.filter(({esEliminado})=> !esEliminado);

            if(submenus?.length === 0 && submenuByMenuPaginadoDto.page !==1){
                const startIndex = (submenuByMenuPaginadoDto.page - 2 )*submenuByMenuPaginadoDto.pageSize;
                const endIndex = startIndex + submenuByMenuPaginadoDto.pageSize;
                return {
                    page:submenuByMenuPaginadoDto.page-1,
                    pageSize:submenuByMenuPaginadoDto.pageSize,
                    items: submenus.slice(startIndex,endIndex),
                    total: submenus.length
                }
            }
            return Paginated.create({
                ...submenuByMenuPaginadoDto,
                items: submenus.slice(startIndex,endIndex),
                total: submenus.length
            });

        }catch(error){
            this.handleExceptions(error)
        }
       
    }

    async getOpcionByBusqueda(menuBusquedaDto:MenuBusquedaDto){
        try{
            const offset = (menuBusquedaDto.page - 1 )*menuBusquedaDto.pageSize;
            const menus = await this.menuService.getMenusByBusquedaSlice(menuBusquedaDto.nombre, menuBusquedaDto.icono,menuBusquedaDto.url, menuBusquedaDto.esSubmenu,menuBusquedaDto.pageSize, offset)
            const totalRegistros = await this.menuService.getMenusCount(menuBusquedaDto.esSubmenu);
            const total = await this.menuService.getMenusByBusquedaCount(menuBusquedaDto.nombre, menuBusquedaDto.icono,menuBusquedaDto.url, menuBusquedaDto.esSubmenu,totalRegistros);

           return Paginated.create({
             page:menuBusquedaDto.page,
             pageSize:menuBusquedaDto.pageSize,
             items: menus,
             total: total.length
           })
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
           
            const menu = Menu.createMenu(createMenuDto.nombre, createMenuDto.esSubmenu,usuarioDto, createMenuDto.icono, createMenuDto.url, );
           
           
            return this.menuService.createMenu(menu);
            
       
        } catch (error) {
            this.handleExceptions(error);
        }
       
    }

    async createSubmenu(createSubmenuDto:CreateSubmenuDto, usuarioDto:string){
        try{
            
            const menuEncontrado = await this.getMenuById(createSubmenuDto.idMenu);
            
            if(menuEncontrado['error'])
            return {error: menuEncontrado['error'], message: menuEncontrado['message']};

            if(menuEncontrado['esBloqueado'])
            return {
                    error: 400,
                    message: `Opcion se encuentra en modificacion`
                    }
            
            await this.bloquearMenu(createSubmenuDto.idMenu, true);

            const menusNombreRepetido=menuEncontrado?.['submenus'].filter(({esEliminado})=>!esEliminado).filter(({nombre})=> nombre===createSubmenuDto.nombre);
            
            if(menusNombreRepetido.length>0){
                return {
                    error:400,
                    message:`El nombre: ${createSubmenuDto.nombre} ya se encuentra en este listado`
                }
            }
            
            const submenu =Menu.createSubmenu(createSubmenuDto.nombre,menuEncontrado?.['sistema']._id, usuarioDto)
           
            const {_id}= await this.menuService.createMenu(submenu);

            let submenusIds:string[]=[];
            if(menuEncontrado?.['submenus'].length>0){
                submenusIds=menuEncontrado?.['submenus']?.map(({_id})=>{
                    return _id
                });
            }
             
            submenusIds.push(_id);

            const menu= Menu.updateMenuSubmenus(submenusIds, usuarioDto);

            return this.menuService.updateMenu(createSubmenuDto.idMenu, menu)
                                                                                                                 

       
        } catch (error) {
            this.handleExceptions(error);
        }finally{
            await this.bloquearMenu(createSubmenuDto.idMenu, false);
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
                };


                //todo : agregar el sistema a los submenus de menu
            }
            
            if(updateMenuDto.opciones?.length > 0 && !menuEncontrado['esSubmenu'])
            return {
                error:400,
                message:"El menu no puede tener opciones ya que no es un submenu"
            }

            if(updateMenuDto.submenus?.length > 0 && menuEncontrado['esSubmenu'])
            return {
                error:400,
                message:"El submenu no puede tener submenus ya que no es un Menu"
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

            if(menuEncontrado?.['esSubmenu'] && (updateMenuDto.icono || updateMenuDto.url) ){
                return {
                    error:404,
                    message:`El submenu no cumple con el formato`
                }
            }
            
            const menu = Menu.updateMenu(updateMenuDto.nombre,menuEncontrado?.['esSubmenu'],updateMenuDto.sistema,updateMenuDto.submenus,updateMenuDto.opciones,updateMenuDto.icono,updateMenuDto.url, usuarioModificacion)
            
            if(!menuEncontrado?.['esSubmenu']){
                const perfiles=await this.perfilService.findAll();
            
                const perfilesFiltrados = perfiles.filter(perfil => {
                    return perfil?.sistemas.some(sistema => {
                    return sistema?.menus.some(menu => {
                        return menu?.id === id && sistema?.esEliminado === false;
                    });
                    });
                });
                
                const actualizarPerfilPromesas=perfilesFiltrados.map(async (perfil) => {
                    const perfilEntity= Perfil.updatePerfil(perfil.tipo, perfil.sistemas, usuarioModificacion);

                    perfilEntity.sistemas=perfilEntity.sistemas.map(sistemaEncontrado=> {
                        const menus= sistemaEncontrado.menus.map(menuEncontrado => {
                                        if(menuEncontrado.id===id){
                                            return {
                                                id:menuEncontrado.id,
                                                nombre:menu.nombre || menuEncontrado.nombre,
                                                icono: menu.icono  || menuEncontrado.icono,
                                                url : menu.url || menuEncontrado.url,
                                                esSubmenu: menu.esSubmenu || menuEncontrado.esSubmenu,
                                                esEliminado:menuEncontrado.esEliminado,
                                                submenus:menuEncontrado.submenus
                                            }
                                        }
                                        return menuEncontrado;
                                    })

                        return {
                            ...sistemaEncontrado,
                            menus
                        }
                    })
                    await this.perfilService.updatePerfil(perfil._id,perfilEntity)
                })
                await Promise.all(actualizarPerfilPromesas);
            }else{

                const perfiles=await this.perfilService.findAll();
                
                const perfilesFiltrados = perfiles.filter(perfil => {
                    return perfil?.sistemas.some(sistema => {
                        return sistema?.menus.some(menu => {
                        return menu?.submenus.some(submenu => {
                            return submenu?.id === id && menu?.esEliminado === false;
                        });
                        });
                    });
                });
                
                
                const actualizarPerfilPromesas=perfilesFiltrados.map(async (perfil) => {
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
                                            return submenuEncontrado;
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
                await Promise.all(actualizarPerfilPromesas);
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
                    return perfil?.sistemas.some(sistema => {
                    return sistema?.menus.some(menu => {
                        return menu?.id === id && sistema?.esEliminado === false;
                    });
                    });
                });
                
                const actualizarPerfilPromesas=perfilesFiltrados.map(async (perfil) => {
                    const perfilEntity= Perfil.updatePerfil(perfil.tipo, perfil.sistemas, usuarioModificacion);

                    perfilEntity.sistemas=perfilEntity.sistemas.map(sistemaEncontrado=> {
                        const menus= sistemaEncontrado.menus.map(menuEncontrado => {
                                        if(menuEncontrado.id===id){
                                            return {
                                                ...menuEncontrado,
                                                esEliminado:true
                                            }
                                        }
                                        return menuEncontrado;
                                    })

                        return {
                            ...sistemaEncontrado,
                            menus
                        }
                    })
                    await this.perfilService.updatePerfil(perfil._id,perfilEntity)
                })
                await Promise.all(actualizarPerfilPromesas);
            }else{

                const perfiles=await this.perfilService.findAll();
            
                const perfilesFiltrados = perfiles.filter(perfil => {
                    return perfil?.sistemas.some(sistema => {
                        return sistema?.menus.some(menu => {
                        return menu?.submenus.some(submenu => {
                            return submenu?.id === id && menu?.esEliminado === false;
                        });
                        });
                    });
                });
                
                const actualizarPerfilPromesas=perfilesFiltrados.map(async (perfil) => {
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
                                            return submenuEncontrado;
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
                await Promise.all(actualizarPerfilPromesas);
            }

            return await this.menuService.deleteMenu(id,menu);

        } catch (error) {
            this.handleExceptions(error);
        }
    }


    async deleteMenuSistema(id:string,idSistema:string,usuarioModificacion:string){
        try {

            const menuEncontrado = await this.getMenuById(id);
            
            if(menuEncontrado['error'])
            return {error: menuEncontrado['error'], message: menuEncontrado['message']}

            const sistema=this.sistemaService.findOneById(idSistema);

            if(!sistema){
                return {
                    error:400,
                    message:`El id ${idSistema} del sistema no fue encontrado`
                }
            }

            const menu= Menu.deleteMenuSistema(usuarioModificacion)

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