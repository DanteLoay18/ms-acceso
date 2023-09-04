import { Document } from "mongoose";
import { Prop,Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class Usuario{

    @Prop({ type: 'UUID', default:uuidv4})
    _id: string;

    @Prop()
    email: string;
    @Prop()
    password: string;

    @Prop({
        unique:true
    })
    nombres: string;

    @Prop()
    apellidos: string;

    @Prop()
    esEliminado:boolean;
}

export const UsuarioSchema= SchemaFactory.createForClass(Usuario)