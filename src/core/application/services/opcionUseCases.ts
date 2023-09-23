import { BadRequestException, Injectable,  } from "@nestjs/common";
import { OpcionService } from "src/core/domain/services/opcion.service";
import { Opcion } from "src/core/domain/entity/collections/opcion.collection";
import { CreateOpcionDto, UpdateOpcionDto } from "src/core/shared/dtos";
import { Perfil } from "src/core/domain/entity/collections";
import { PerfilService } from "src/core/domain/services/perfil.service";
import { Paginated } from "../utils/Paginated";
import { OpcionBusquedaDto } from "src/core/shared/dtos/opcion/opcion-busqueda.dto";
import { OpcionesPaginadoDto } from "src/core/shared/dtos/opcion/opciones-paginado.dto";



@Injectable()
export class OpcionUseCases{
    constructor(
               private readonly opcionService:OpcionService,
               private readonly perfilService:PerfilService){}

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

    async getOpcionByBusqueda(opcionBusquedaDto:OpcionBusquedaDto){
        try{
            const offset = (opcionBusquedaDto.page - 1 )*opcionBusquedaDto.pageSize;
            const opciones = await this.opcionService.getOpcionesByBusquedaSlice(opcionBusquedaDto.nombre, opcionBusquedaDto.icono, opcionBusquedaDto.esEmergente,opcionBusquedaDto.pageSize, offset)
            const totalRegistros = await this.opcionService.getOpcionesCount();
            const total = await this.opcionService.getOpcionesByBusquedaCount(opcionBusquedaDto.nombre, opcionBusquedaDto.icono, opcionBusquedaDto.esEmergente,totalRegistros);

           return Paginated.create({
             page:opcionBusquedaDto.page,
             pageSize:opcionBusquedaDto.pageSize,
             items: opciones,
             total: total.length
           })
        }catch(error){
            this.handleExceptions(error)
        }
        
    }

    async getAllOpciones(opcionesPaginadoDto:OpcionesPaginadoDto){
        
        try{
            const offset = (opcionesPaginadoDto.page - 1 )*opcionesPaginadoDto.pageSize;
            const opciones = await this.opcionService.getOpcionesSlice(opcionesPaginadoDto.pageSize, offset)
            const total = await this.opcionService.getOpcionesCount();

            if(opciones.length === 0 && opcionesPaginadoDto.page !==1){
                const offset = (opcionesPaginadoDto.page - 2 )*opcionesPaginadoDto.pageSize;
                const opciones = await this.opcionService.getOpcionesSlice(opcionesPaginadoDto.pageSize, offset);
                return {
                    page:opcionesPaginadoDto.page-1,
                    pageSize:opcionesPaginadoDto.pageSize,
                    items: opciones,
                    total: total
                }
            }
            return Paginated.create({
                ...opcionesPaginadoDto,
                items: opciones,
                total: total
            });

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
            
            
            const perfiles=await this.perfilService.findAll();
        
            const perfilesFiltrados = perfiles.filter(perfil => {
                return perfil?.sistemas.some(sistema => {
                    return sistema?.menus.some(menu => {
                    return menu?.submenus.some(submenu => {
                        return submenu?.opciones.some(opcion=> {
                            return opcion?.id === id && opcion?.esEliminado ===false;
                        });
                    });
                    });
                });
            });

            const actualizarPerfilPromesas=perfilesFiltrados.map(async (perfil) => {
                const perfilEntity= Perfil.updatePerfil(perfil.tipo, perfil.sistemas, usuarioModificacion);
                perfilEntity.sistemas=perfilEntity.sistemas.map(sistemaEncontrado=> {
                    const menus= sistemaEncontrado.menus.map(menuEncontrado => {
                                    const submenus= menuEncontrado.submenus.map(submenuEncontrado=> {
                                            const opciones = submenuEncontrado.opciones.map(opcionEncontrado=>{
                                                if(opcionEncontrado.id===id){
                                                  
                                                    return {
                                                        id:opcionEncontrado.id,
                                                        nombre:opcion.nombre || opcionEncontrado.nombre,
                                                        icono: opcion.icono || opcionEncontrado.icono,
                                                        tieneOpciones:opcion.tieneOpciones || opcionEncontrado.tieneOpciones,
                                                        esEmergente:opcion.esEmergente || opcionEncontrado.esEmergente,
                                                        esEliminado:opcionEncontrado.esEliminado
                                                    }
                                                }
                                                return opcionEncontrado
                                            })
                                            return {
                                                ...submenuEncontrado,
                                                opciones
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
            await Promise.all(actualizarPerfilPromesas);

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

            const opcion = Opcion.deleteOpcion(usuarioModificacion);

            const perfiles=await this.perfilService.findAll();
        
            const perfilesFiltrados = perfiles.filter(perfil => {
                return perfil?.sistemas.some(sistema => {
                    return sistema?.menus.some(menu => {
                    return menu?.submenus.some(submenu => {
                        return submenu?.opciones.some(opcion=> {
                            return opcion?.id === id && opcion?.esEliminado ===false;
                        });
                    });
                    });
                });
            });
            
            const actualizarPerfilPromesas =perfilesFiltrados.map(async (perfil) => {
                const perfilEntity= Perfil.updatePerfil(perfil.tipo, perfil.sistemas, usuarioModificacion);

                perfilEntity.sistemas=perfilEntity.sistemas.map(sistemaEncontrado=> {
                    const menus= sistemaEncontrado.menus.map(menuEncontrado => {
                                    const submenus= menuEncontrado.submenus.map(submenuEncontrado=> {
                                            const opciones = submenuEncontrado.opciones.map(opcionEncontrado=>{
                                                if(opcionEncontrado.id===id){
                                                    return {
                                                       ...opcionEncontrado,
                                                        esEliminado:true
                                                    }
                                                }
                                                return opcionEncontrado;
                                            })
                                            return {
                                                ...submenuEncontrado,
                                                opciones
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
            await Promise.all(actualizarPerfilPromesas);
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