import { BadRequestException, Injectable,  } from "@nestjs/common";
import { Perfil, Sistema } from "src/core/domain/entity/collections";
import { SistemaService } from "src/core/domain/services/sistema.service";
import { CreateSistemaDto, SistemaBusquedaDto, UpdateSistemaDto } from "src/core/shared/dtos";
import { PerfilService } from '../../domain/services/perfil.service';
import { SistemasPaginadoDto } from "src/core/shared/dtos/sistema/sistemas-paginado.dto";
import { Paginated } from "../utils/Paginated";



@Injectable()
export class SistemaUseCases{
    constructor(private readonly sistemaService:SistemaService, private readonly perfilService:PerfilService){}

    async getSistemaById(id:string){
        try{
            const Sistema= await this.sistemaService.findOneById(id);

            if(!Sistema || Sistema.esEliminado)
            return {error: 404, message: `El sistema con el id ${id} no existe`}

            return Sistema;

        }catch(error){
            this.handleExceptions(error)
        }
        
    }
    async getOpcionByBusqueda(sistemaBusquedaDto:SistemaBusquedaDto){
        try{
            const offset = (sistemaBusquedaDto.page - 1 )*sistemaBusquedaDto.pageSize;
            const opciones = await this.sistemaService.getSistemasByBusquedaSlice(sistemaBusquedaDto.nombre, sistemaBusquedaDto.icono, sistemaBusquedaDto.puerto ,sistemaBusquedaDto.url,sistemaBusquedaDto.pageSize, offset)
            const totalRegistros = await this.sistemaService.getSistemasCount();
            const total = await this.sistemaService.getSistemasByBusquedaCount(sistemaBusquedaDto.nombre, sistemaBusquedaDto.icono,  sistemaBusquedaDto.puerto ,sistemaBusquedaDto.url,totalRegistros);

           return Paginated.create({
             page:sistemaBusquedaDto.page,
             pageSize:sistemaBusquedaDto.pageSize,
             items: opciones,
             total: total.length
           })
        }catch(error){
            this.handleExceptions(error)
        }
        
    }

    async getAllSistemas(sistemasPadinadoDto:SistemasPaginadoDto){
        
        try{
            const offset = (sistemasPadinadoDto.page - 1 )*sistemasPadinadoDto.pageSize;
            const opciones = await this.sistemaService.getSistemasSlice(sistemasPadinadoDto.pageSize, offset)
            const total = await this.sistemaService.getSistemasCount();

            if(opciones.length === 0 && sistemasPadinadoDto.page !==1){
                const offset = (sistemasPadinadoDto.page - 2 )*sistemasPadinadoDto.pageSize;
                const opciones = await this.sistemaService.getSistemasSlice(sistemasPadinadoDto.pageSize, offset);
                return {
                    page:sistemasPadinadoDto.page-1,
                    pageSize:sistemasPadinadoDto.pageSize,
                    items: opciones,
                    total: total
                }
            }
            return Paginated.create({
                ...sistemasPadinadoDto,
                items: opciones,
                total: total
            });

        }catch(error){
            this.handleExceptions(error)
        }
       
    }

    async createSistema(createSistemaDto:CreateSistemaDto, usuarioDto:string){
        try {
            
            const sistemaByNombreEncontrado= await this.findOneByTerm(createSistemaDto.nombre,"");
                
            if(sistemaByNombreEncontrado?.['error'])
            return {
                error: sistemaByNombreEncontrado['error'],
                message: sistemaByNombreEncontrado['message']
                }

            const sistema = Sistema.createSistema(createSistemaDto.nombre, createSistemaDto.url, createSistemaDto.imagen, createSistemaDto.puerto,createSistemaDto.icono, usuarioDto);
           
            return this.sistemaService.createSistema(sistema);
            
       
        } catch (error) {
            this.handleExceptions(error);
        }
       
    }

    async updateSistema(id:string, updateSistemaDto:UpdateSistemaDto, usuarioModificacion:string ){
        
        try {
            
            const SistemaEncontrado = await this.getSistemaById(id);
            
            if(SistemaEncontrado['error'])
            return {error: SistemaEncontrado['error'], message: SistemaEncontrado['message']}


            if(SistemaEncontrado['esBloqueado'])
                return {
                        error: 400,
                        message: `Sistema se encuentra en modificacion`
                        }

            await this.bloquearSistema(id, true);

            if(updateSistemaDto.nombre){
                const sistemaByNombreEncontrado= await this.findOneByTerm(updateSistemaDto.nombre,id);
                
                if(sistemaByNombreEncontrado?.['error'])
                return {
                    error: sistemaByNombreEncontrado['error'],
                    message: sistemaByNombreEncontrado['message']
                    }
            }

            const sistema = Sistema.updateSistema(updateSistemaDto.nombre,updateSistemaDto.url,updateSistemaDto.imagen,updateSistemaDto.puerto,updateSistemaDto.icono,usuarioModificacion)
            
            const perfiles=await this.perfilService.findAll();

            const perfilesFiltrados = perfiles.filter(perfil => {
                return perfil?.sistemas.some(sistema => sistema?.id === id);
              });
            const actualizarPerfilPromesas=perfilesFiltrados.map(async (perfil) => {
                const perfilEntity= Perfil.updatePerfil(perfil.tipo, perfil.sistemas, usuarioModificacion);

                perfilEntity.sistemas=perfilEntity.sistemas.map(sistemaEncontrado=> {
                    if(sistemaEncontrado.id === id){
                        return {
                            id:sistemaEncontrado.id,
                            imagen:sistema.imagen || sistemaEncontrado.imagen  ,
                            nombre:sistema.nombre || sistemaEncontrado.nombre,
                            url: sistema.url || sistemaEncontrado.url,
                            puerto: sistema.puerto || sistemaEncontrado.puerto,
                            icono: sistema.icono || sistemaEncontrado.icono,
                            esEliminado:sistemaEncontrado.esEliminado,
                            menus:sistemaEncontrado.menus
                        }
                    }
                    return sistemaEncontrado;
                })
                
                await this.perfilService.updatePerfil(perfil._id,perfilEntity)
            })
            await Promise.all(actualizarPerfilPromesas);
            return await this.sistemaService.updateSistema(id, sistema);

        } catch (error) {
            this.handleExceptions(error);
        }
        finally{
            await this.bloquearSistema(id, false);
        }
       
    }

    async deleteSistema(id:string,usuarioModificacion:string){
        try {
            const SistemaEncontrado = await this.getSistemaById(id);
            
            if(SistemaEncontrado['error'])
            return {error: SistemaEncontrado['error'], message: SistemaEncontrado['message']}

            const sistema= Sistema.deleteSistema(usuarioModificacion)

            const perfiles=await this.perfilService.findAll();

            const perfilesFiltrados = perfiles.filter(perfil => {
                return perfil?.sistemas.some(sistema => sistema?.id === id);
              });

            const actualizarPerfilPromesas=perfilesFiltrados.map(async (perfil) => {
                const perfilEntity= Perfil.updatePerfil(perfil.tipo, perfil.sistemas, usuarioModificacion);

                perfilEntity.sistemas=perfilEntity.sistemas.map(sistemaEncontrado=> {
                    if(sistemaEncontrado.id === id){
                        return {
                            ...sistemaEncontrado,
                            esEliminado:true
                        }
                    }
                    return sistemaEncontrado;
                })
                
                await this.perfilService.updatePerfil(perfil._id,perfilEntity)
            })
            await Promise.all(actualizarPerfilPromesas);
            return await this.sistemaService.deleteSistema(id,sistema);

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
        return {
                error:400,
                message:`El nombre ${term} ya esta registrado`
            }
       
        return sistema;

        
    }

    private handleExceptions(error:any){
        
        if(error.code==="23505")
        throw new BadRequestException(error.detail)
        
        

        throw new BadRequestException(error.message)
      }
}