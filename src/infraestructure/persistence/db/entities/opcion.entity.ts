
import { Prop,Schema, SchemaFactory } from '@nestjs/mongoose';
import { Base } from '../helpers';


@Schema()
export class Opcion extends Base{

    @Prop({
        type:String,
        unique:true, 
        required:true    
    })
    nombre: string;

    @Prop({
        type:String,
        required:true
    })
    icono: string;

    @Prop({
        type:Boolean,
        required:true
    })
    tieneOpciones:boolean;
    
    @Prop({
        type:Boolean,
        required:true
    })
    esEmergente:boolean;


    
}

export const OpcionSchema= SchemaFactory.createForClass(Opcion)