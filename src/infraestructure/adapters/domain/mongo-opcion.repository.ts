import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Opcion } from "src/core/domain/entity/collections/opcion.collection";
import { Usuario } from "src/core/domain/entity/collections/usuario.collection";
import { OpcionRepository } from "src/core/domain/ports/outbound";


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
    
    
   
}