import { BadRequestException, Injectable, NotFoundException,  } from "@nestjs/common";
import { Menu } from "src/core/domain/entity/collections";
import { MenuService, OpcionService, SistemaService } from "src/core/domain/services";
import { CreateMenuDto, UpdateMenuDto, UsuarioDto } from "src/core/shared/dtos";

@Injectable()
export class MenuUseCases{
    constructor(
                private readonly menuService:MenuService,
                private readonly sistemaService:SistemaService,
                private readonly opcionService:OpcionService){}

    async getMenuById(id:string){
        try{
            const menu= await this.menuService.findOneById(id);

            if(!menu || menu.esEliminado)
                throw new NotFoundException(`El menu con el id ${id} no existe`)

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

    async createMenu(createMenuDto:CreateMenuDto, usuarioDto:UsuarioDto){
        try {
            
            await this.findOneByTerm(createMenuDto.nombre, "")

            const menu = Menu.createMenu(createMenuDto.nombre, createMenuDto.esSubmenu, usuarioDto._id);
           
            return this.menuService.createMenu(menu);
            
       
        } catch (error) {
            console.log(error)
            this.handleExceptions(error);
        }
       
    }

    async updateMenu(id:string, updateMenuDto:UpdateMenuDto, usuarioModificacion:UsuarioDto ){
        
        try {
            
            const opcionEncontrado = await this.getMenuById(id);
            
            if(opcionEncontrado.esBloqueado)
                throw new BadRequestException(`Menu se encuentra en modificacion`)

            await this.bloquearMenu(id, true);
            
            if(updateMenuDto.nombre)
            await this.findOneByTerm(updateMenuDto.nombre, id);

            if(updateMenuDto.sistema){
                const sistema= await this.sistemaService.findOneById(updateMenuDto.sistema);

                if(!sistema || sistema.esEliminado)
                 throw new NotFoundException(`El sistema con el id ${updateMenuDto.sistema} no existe`)
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
                  opcionesInvalidas.forEach((resultado) => {throw new NotFoundException(`Opcion con el Id ${resultado.opcionId} no encontrado`)})
                  
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
                  menusInvalidos.forEach((resultado) => {throw new NotFoundException(`Submenu con el Id ${resultado.submenuId} no esta registrado o no es un submenu valido`)})

                
              }  

            const menu = Menu.updateMenu(updateMenuDto.nombre,updateMenuDto.esSubmenu,updateMenuDto.sistema,updateMenuDto.submenus,updateMenuDto.opciones,usuarioModificacion._id)
            
            return await this.menuService.updateMenu(id, menu);

        } catch (error) {
            this.handleExceptions(error);
        }
        finally{
            await this.bloquearMenu(id, false);
        }
       
    }

    async deleteMenu(id:string){
        try {
            await this.getMenuById(id);

            return await this.menuService.deleteMenu(id);

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
            throw new BadRequestException(`El nombre ${term} ya esta registrado`)
        

        return menu;

        
    }

    private handleExceptions(error:any){
        
        if(error.code==="23505")
        throw new BadRequestException(error.detail)
        
        

        throw new BadRequestException(error.message)
      }
}