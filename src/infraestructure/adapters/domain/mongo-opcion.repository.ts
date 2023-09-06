import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { OpcionRepository } from "src/core/domain/ports/outbound";
import { Opcion } from "src/infraestructure/persistence/db/entities";


@Injectable()
export class MongoOpcionRepository implements OpcionRepository {
    
    constructor(@InjectModel(Opcion.name) private opcionRepository: Model<Opcion>) { }
   
    
    
    createOpcion(opcion: Opcion): Promise<Opcion> {
        return this.opcionRepository.create(opcion);
    }
    findOneById(id: string): Promise<Opcion> {
        return this.opcionRepository.findById(id);
    }
    findAll(): Promise<Opcion[]> {
        return this.opcionRepository.find({esEliminado:false})
    }
    updateOpcion(id: string, opcion: Opcion): Promise<Opcion> {
        return this.opcionRepository.findByIdAndUpdate(id, opcion, {new:true})
    }
    deleteOpcion(id: string): Promise<Opcion> {
        return this.opcionRepository.findByIdAndUpdate(id, {
                                                            esEliminado:true  
                                                            }, {new:true})
    }
    actualizarBloqueo(id: string, esBloqueado: boolean): Promise<Opcion> {
        return this.opcionRepository.findByIdAndUpdate(id, {
                                                                esBloqueado  
                                                                }, {new:true})
    }
    findByNombre(nombre: string): Promise<Opcion> {
        return this.opcionRepository.findOne({nombre, esEliminado:false})
    }
    findByIcono(icono: string): Promise<Opcion> {
        return this.opcionRepository.findOne({icono, esEliminado:false})
    }
    
   
}