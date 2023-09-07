
import { Prop,Schema, SchemaFactory } from '@nestjs/mongoose';

import { Base } from '../helpers';
import { PerfilesDto } from 'src/infraestructure/http-server/model/usuario/perfiles.dto';

@Schema()
export class Usuario extends Base{

    @Prop({
        type:String,
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

    @Prop({ type: [
                    {
                     perfil: { type: 'UUID', ref: 'Perfil' },
                     activo:{type:Boolean}
                    },
                ],
          })
    perfiles: PerfilesDto[];

    
}

export const UsuarioSchema= SchemaFactory.createForClass(Usuario)