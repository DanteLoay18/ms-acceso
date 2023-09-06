import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SistemaRepository } from "src/core/domain/ports/outbound/sistema.repository";
import { Sistema } from "src/infraestructure/persistence/db/entities";


@Injectable()
export class MongoSistemaRepository implements SistemaRepository {
    
    constructor(@InjectModel(Sistema.name) private sistemaRepository: Model<Sistema>) { }
   
    
    
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
    deleteSistema(id: string): Promise<Sistema> {
        return this.sistemaRepository.findByIdAndUpdate(id, {
                                                            esEliminado:true  
                                                            }, {new:true})
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