import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Base } from '../helpers';
import { SistemasDto } from '../helpers/sistemas.dto';


@Schema()
export class Perfil extends Base {
  
  @Prop({ required: true})
  tipo: string;

  @Prop({
    type: [
      {
        sistema: { type: 'UUID', ref: 'Sistema' },
        menus: [
          {
            menu: { type: 'UUID', ref: 'Menu' },
            submenus: [
              {
                submenu: { type: 'UUID', ref: 'Menu' },
                opciones: [
                  
                  {type: 'UUID', ref: "Opcion"}
                  
                ]
              },
            ],
          },
        ],
      },
    ],
  })
  sistemas: SistemasDto[];

 
}



export const PerfilSchema = SchemaFactory.createForClass(Perfil);