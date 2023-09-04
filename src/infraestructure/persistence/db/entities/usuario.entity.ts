import { Document } from "mongoose";
import { Prop,Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class Usuario{

    @Prop({ type: 'UUID', default:uuidv4})
    _id: string;

    @Prop({
        type:String,
        unique:true, 
        required:true    
    })
    email: string;
    
    @Prop({
        type:String,
        required:true
    })
    password: string;

    @Prop({
        type:String,
        required:true
    })
    nombres: string;

    @Prop({
        type:String,
        required:true
    })
    apellidos: string;

    @Prop({
        type:Boolean,
        required:true
    })
    esEliminado:boolean;
}

export const UsuarioSchema= SchemaFactory.createForClass(Usuario)