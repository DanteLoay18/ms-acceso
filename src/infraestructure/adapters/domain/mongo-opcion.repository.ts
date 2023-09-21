import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { OpcionRepository } from "src/core/domain/ports/outbound";
import { Opcion } from "src/infraestructure/persistence/db/entities";


@Injectable()
export class MongoOpcionRepository implements OpcionRepository {
    
    constructor(@InjectModel(Opcion.name) private opcionRepository: Model<Opcion>) { }
    
    
    findByBusquedaSlice(nombre: string, icono: string, esEmergente: boolean, limit: number, offset: number): Promise<Opcion[]> {
        let query = {};

        if (nombre) {
        query['nombre'] = { $regex: nombre }; 
        }

        if (icono) {
        query['icono'] = { $regex: icono };
        }
        if (esEmergente) {
            query['esEmergente'] = esEmergente;
        }

        const opciones =  this.opcionRepository.find({
            ...query,
            esEliminado: false
        })
          .limit(limit)
          .skip(offset).exec();

        return opciones;
    }
    
    
    findBySlice(limit: number, offset: number): Promise<Opcion[]> {
        
        return this.opcionRepository.find({esEliminado:false})
            .limit(limit)
            .skip(offset)
        
    }
    
    count(): Promise<number> {
        return this.opcionRepository.countDocuments({esEliminado:false})
    }
    
    
    createOpcion(opcion: Opcion): Promise<Opcion> {
        return this.opcionRepository.create(opcion);
    }
    findOneById(id: string): Promise<Opcion> {
        return this.opcionRepository.findById(id);
    }
    updateOpcion(id: string, opcion: Opcion): Promise<Opcion> {
        return this.opcionRepository.findByIdAndUpdate(id, opcion, {new:true})
    }
    deleteOpcion(id: string, opcion:Opcion): Promise<Opcion> {
        return this.opcionRepository.findByIdAndUpdate(id, opcion, {new:true})
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