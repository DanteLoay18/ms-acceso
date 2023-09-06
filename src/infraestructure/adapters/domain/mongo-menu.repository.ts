import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { MenuRepository } from "src/core/domain/ports/outbound";
import { Menu } from "src/infraestructure/persistence/db/entities";


@Injectable()
export class MongoMenuRepository implements MenuRepository {
    
    constructor(@InjectModel(Menu.name) private menuRepository: Model<Menu>) { }
   
    
    
    createMenu(menu: Menu): Promise<Menu> {
        return this.menuRepository.create(menu);
    }

    findOneById(id: string): Promise<Menu> {
        return this.menuRepository.findById(id);
    }

    findAll(): Promise<Menu[]> {
        return this.menuRepository.find({esEliminado:false})
    }
    updateMenu(id: string, menu: Menu): Promise<Menu> {
        return this.menuRepository.findByIdAndUpdate(id, menu, {new:true})
    }
    deleteMenu(id: string): Promise<Menu> {
        return this.menuRepository.findByIdAndUpdate(id, {
                                                            esEliminado:true  
                                                            }, {new:true})
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