import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PerfilRepository } from "src/core/domain/ports/outbound";
import { Perfil } from "src/infraestructure/persistence/db/entities/perfil.entity";


@Injectable()
export class MongoPerfilRepository implements PerfilRepository {
    
    constructor(@InjectModel(Perfil.name) private perfilRepository: Model<Perfil>) { }
    
    
    
    createPerfil(perfil: Perfil): Promise<Perfil> {
        return this.perfilRepository.create(perfil);
    }

    findOneById(id: string): Promise<Perfil> {
        return this.perfilRepository.findById(id).populate([
                                                            {path:'sistemas.sistema',select: 'nombre url imagen puerto esEliminado '},
                                                            {path:'sistemas.menus.menu',select: 'nombre sistema opciones esEliminado'},
                                                            {path:'sistemas.menus.submenus.submenu',select: 'nombre sistema opciones esEliminado'},
                                                            {path:'sistemas.menus.submenus.opciones',select: 'nombre icono tieneOpciones esEmergente esEliminado'}
                                                        ]) ;
    }

    findAll(): Promise<Perfil[]> {
        return this.perfilRepository.find({esEliminado:false}).populate([
                                                                {path:'sistemas.sistema',select: 'nombre url imagen puerto esEliminado'},
                                                                {path:'sistemas.menus.menu',select: 'nombre sistema opciones esEliminado'},
                                                                {path:'sistemas.menus.submenus.submenu',select: 'nombre sistema opciones esEliminado'},
                                                                {path:'sistemas.menus.submenus.opciones',select: 'nombre icono tieneOpciones esEmergente esEliminado'}
                                                                ]) ;
    }
    updatePerfil(id: string, perfil: Perfil): Promise<Perfil> {
        return this.perfilRepository.findByIdAndUpdate(id, perfil, {new:true})
    }
    deletePerfil(id: string, perfil:Perfil): Promise<Perfil> {
        return this.perfilRepository.findByIdAndUpdate(id, perfil, {new:true})
    }

    findByTipo(tipo: string): Promise<Perfil> {
        return this.perfilRepository.findOne({tipo, esEliminado:false})
    }
   
    actualizarBloqueo(id: string, esBloqueado: boolean): Promise<Perfil> {
        return this.perfilRepository.findByIdAndUpdate(id, {
                                                                esBloqueado  
                                                                }, {new:true})
    }
    findByNombre(nombre: string): Promise<Perfil> {
        return this.perfilRepository.findOne({nombre, esEliminado:false})
    }
    
   
}