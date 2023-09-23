import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SistemaRepository } from "src/core/domain/ports/outbound/sistema.repository";
import { Sistema } from "src/infraestructure/persistence/db/entities";


@Injectable()
export class MongoSistemaRepository implements SistemaRepository {
    
    constructor(@InjectModel(Sistema.name) private sistemaRepository: Model<Sistema>) { }


    findBySlice(limit: number, offset: number): Promise<Sistema[]> {
        return this.sistemaRepository.find({esEliminado:false})
            .limit(limit)
            .skip(offset)
    }
    
    findByBusquedaSlice(nombre: string, icono: string, puerto: string, url: string, limit: number, offset: number): Promise<Sistema[]> {
        let query = {};

        if (nombre) {
        query['nombre'] = { $regex: nombre }; 
        }

        if (icono) {
        query['icono'] = { $regex: icono };
        }
        if (puerto) {
            query['puerto'] = { $regex: puerto };
        }
        if (url) {
            query['url'] = { $regex: url };
        }

        const sistemas =  this.sistemaRepository.find({
            ...query,
            esEliminado: false
        })
          .limit(limit)
          .skip(offset).exec();

        return sistemas;
    }
    count(): Promise<number> {
        return this.sistemaRepository.countDocuments({esEliminado:false})
    }
   
    
    
    createSistema(sistema: Sistema): Promise<Sistema> {
        return this.sistemaRepository.create(sistema);
    }

    findOneById(id: string): Promise<Sistema> {
        return this.sistemaRepository.findById(id);
    }

    findAll(): Promise<Sistema[]> {
        return this.sistemaRepository.find({esEliminado:false})
    }
    updateSistema(id: string, sistema: Sistema): Promise<Sistema> {
        return this.sistemaRepository.findByIdAndUpdate(id, sistema, {new:true})
    }
    deleteSistema(id: string, sistema:Sistema): Promise<Sistema> {
        return this.sistemaRepository.findByIdAndUpdate(id, sistema, {new:true})
    }
    actualizarBloqueo(id: string, esBloqueado: boolean): Promise<Sistema> {
        return this.sistemaRepository.findByIdAndUpdate(id, {
                                                                esBloqueado  
                                                                }, {new:true})
    }
    findByNombre(nombre: string): Promise<Sistema> {
        return this.sistemaRepository.findOne({nombre, esEliminado:false})
    }
    
   
}