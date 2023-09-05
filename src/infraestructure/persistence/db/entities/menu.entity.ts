

import { Prop,Schema, SchemaFactory } from '@nestjs/mongoose';
import { Base } from '../helpers';


@Schema()
export class Menu extends Base{

    @Prop({ required: true })
    nombre: string;

    @Prop({ type:'UUID', ref:'Usuario' })
    sistema: string;

    @Prop({ type: [{ type: 'UUID', ref: 'Menu' }] })
    submenus: string[];

    @Prop({ type: [{ type: 'UUID', ref: 'Opcion' }] })
    opciones: string[];

    @Prop({required:true})
    esSubmenu:boolean;
    
}

export const MenuSchema= SchemaFactory.createForClass(Menu)







