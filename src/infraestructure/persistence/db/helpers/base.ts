import { Prop } from "@nestjs/mongoose";
import { v4 as uuidv4 } from 'uuid';

export abstract class Base {
    
    @Prop({ type: 'UUID', default:uuidv4})
    _id: string;
    
    @Prop({
        type:Boolean,
        required:true
    })
    esEliminado:boolean;

    @Prop({
        type:Boolean,
        required:true
    })
    esBloqueado:boolean;

    @Prop({
        type:Date,
        required:true
    })
    fechaCreacion:Date;

    @Prop({
        type:Date,
        required:true
    })
    fechaModificacion:Date;

    @Prop({
        type:'UUID',
        ref:'Usuario'
    })
    usuarioCreacion: string;

    @Prop({
        type:'UUID',
        ref:'Usuario'
    })
    usuarioModificacion: string;
    
}