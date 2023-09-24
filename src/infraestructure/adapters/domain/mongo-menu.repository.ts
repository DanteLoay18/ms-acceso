import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MenuRepository } from "src/core/domain/ports/outbound";
import { Menu } from "src/infraestructure/persistence/db/entities";


@Injectable()
export class MongoMenuRepository implements MenuRepository {
    
    constructor(@InjectModel(Menu.name) private menuRepository: Model<Menu>) { }



    findBySlice(limit: number, offset: number, esSubmenu: boolean): Promise<Menu[]> {
        return this.menuRepository.find({esEliminado:false, esSubmenu})
                                                                        .limit(limit)
                                                                        .skip(offset)
    }
    findByBusquedaSlice(nombre: string, icono: string, url: string, limit: number, offset: number): Promise<Menu[]> {
        throw new Error("Method not implemented.");
    }
    count(esSubmenu:boolean): Promise<number> {
        return this.menuRepository.countDocuments({esEliminado:false, esSubmenu})
    }
   
    
    
    createMenu(menu: Menu): Promise<Menu> {
        return this.menuRepository.create(menu);
    }

    findOneById(id: string): Promise<Menu> {
        return this.menuRepository.findById(id).populate([
                                                    {path:'sistema',select: 'nombre url imagen puerto esEliminado '},
                                                    {path:'submenus',select: 'nombre sistema opciones esEliminado '},
                                                    {path:'opciones',select: 'nombre icono tieneOpciones esEmergente esEliminado'}
                                                    ]) ;;
    }

    findAll(): Promise<Menu[]> {
        return this.menuRepository.find({esEliminado:false}).populate([
                                                            {path:'sistema',select: 'nombre url imagen puerto esEliminado '},
                                                            {path:'submenus',select: 'nombre sistema opciones esEliminado'},
                                                            {path:'opciones',select: 'nombre icono tieneOpciones esEmergente esEliminado'}
                                                            ]) ;;
    }
    updateMenu(id: string, menu: Menu): Promise<Menu> {
        return this.menuRepository.findByIdAndUpdate(id, menu, {new:true})
    }
    deleteMenu(id: string, menu:Menu): Promise<Menu> {
        return this.menuRepository.findByIdAndUpdate(id, menu, {new:true})
    }
    actualizarBloqueo(id: string, esBloqueado: boolean): Promise<Menu> {
        return this.menuRepository.findByIdAndUpdate(id, {
                                                                esBloqueado  
                                                                }, {new:true})
    }
    findByNombre(nombre: string): Promise<Menu> {
        return this.menuRepository.findOne({nombre, esEliminado:false})
    }
    
   
}