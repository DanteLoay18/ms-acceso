
import { PartialType } from '@nestjs/swagger';
import { CreatePerfilRequest } from "./create-perfil.request";
import { SistemasDto } from './sistemas.dto';

export class UpdatePerfilRequest extends PartialType(CreatePerfilRequest){

    id:string;
   
    sistemas:SistemasDto[];

}
    