import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Base } from '../helpers';
import { SistemasDto } from '../helpers/sistemas.dto';


@Schema()
export class Perfil extends Base {
  @Prop({ required: true, unique:true })
  tipo: string;

  @Prop()
  sistemas: SistemasDto[];

 
}



export const PerfilSchema = SchemaFactory.createForClass(Perfil);