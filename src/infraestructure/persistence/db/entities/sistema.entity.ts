
import { Prop,Schema, SchemaFactory } from '@nestjs/mongoose';
import { Base } from '../helpers';


@Schema()
export class Sistema extends Base{

    @Prop({ required: true })
    nombre: string;
   
    @Prop({ required: true })
    url: string;
  
    @Prop({ required: true })
    imagen: string;
  
    @Prop({ required: true })
    puerto: string;
   
    
}

export const SistemaSchema= SchemaFactory.createForClass(Sistema)