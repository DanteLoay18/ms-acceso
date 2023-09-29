import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MenuRepository } from "src/core/domain/ports/outbound";
import { Menu } from "src/infraestructure/persistence/db/entities";


@Injectable()
export class MongoMenuRepository implements MenuRepository {
    
    constructor(@InjectModel(Menu.name) private menuRepository: Model<Menu>) { }


    findSubmenusByMenuSlice(id: string, esSubmenu: boolean): Promise<Menu> {
        return this.menuRepository.findOne({esEliminado:false, esSubmenu, _id:id}).populate([
                                                                                        {path:'sistema',select: 'nombre url imagen puerto esEliminado '},
                                                                                        {path:'submenus',select: 'nombre sistema opciones esSubmenu  esEliminado'},
                                                                                        {path:'opciones',select: 'nombre icono tieneOpciones esEmergente esEliminado'}
                                                                                        ]).exec();
    }



    findBySlice(limit: number, offset: number, esSubmenu: boolean): Promise<Menu[]> {
        return this.menuRepository.find({esEliminado:false, esSubmenu})
                                                                        .limit(limit)
                                                                        .skip(offset).populate([
                                                                                        {path:'sistema',select: 'nombre url imagen puerto esEliminado '},
                                                                                        {path:'submenus',select: 'nombre sistema opciones esSubmenu esEliminado'},
                                                                                        {path:'opciones',select: 'nombre icono tieneOpciones esEmergente esEliminado'}
                                                                                        ]).exec();
    }
    findByBusquedaSlice(nombre: string, icono: string, url: string, esSubmenu:boolean, limit: number, offset: number): Promise<Menu[]> {
        let query = {};

        if (nombre) {
        query['nombre'] = { $regex: nombre }; 
        }

        if (icono) {
        query['icono'] = { $regex: icono };
        }
        if (url) {
            query['url'] = { $regex: url };
        }

        const sistemas =  this.menuRepository.find({
            ...query,
            esEliminado: false,
            esSubmenu
        })
          .limit(limit)
          .skip(offset).populate([
            {path:'sistema',select: 'nombre url imagen puerto esEliminado '},
            {path:'submenus',select: 'nombre sistema opciones esSubmenu esEliminado'},
            {path:'opciones',select: 'nombre icono tieneOpciones esEmergente esEliminado'}
            ]).exec();

        return sistemas;
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
                                                    {path:'submenus',select: 'nombre sistema opciones esSubmenu esEliminado '},
                                                    {path:'opciones',select: 'nombre icono tieneOpciones esEmergente esEliminado'}
                                                    ]) ;;
    }

    findAll(): Promise<Menu[]> {
        return this.menuRepository.find({esEliminado:false}).populate([
                                                            {path:'sistema',select: 'nombre url imagen puerto esEliminado '},
                                                            {path:'submenus',select: 'nombre sistema opciones esSubmenu esEliminado'},
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