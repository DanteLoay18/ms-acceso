
import { Prop,Schema, SchemaFactory } from '@nestjs/mongoose';

import { Base } from '../helpers';

@Schema()
export class Usuario extends Base{

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
        type:String,
        required:true
    })
    defaultPassword: string;

    @Prop({
        type:Boolean,
        required:true
    })
    isDefaultPassword:boolean;

    @Prop({
        type:String,
        required:true
    })
    avatarText:string;

   

    
}

export const UsuarioSchema= SchemaFactory.createForClass(Usuario)