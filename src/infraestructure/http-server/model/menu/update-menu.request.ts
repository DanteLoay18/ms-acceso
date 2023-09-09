import { IsArray, IsOptional, IsString, IsUUID } from "class-validator";
import { CreateMenuRequest } from "./create-menu.request";
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class UpdateMenuRequest extends PartialType(CreateMenuRequest){
    id:string;
    
    sistema: string;

    submenus: string[];
    
    opciones: string[];

    

}
    