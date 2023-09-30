import { PartialType } from "@nestjs/swagger";
import { CreateMenuDto } from "./create-menu.dto";


export class UpdateMenuDto extends PartialType(CreateMenuDto){

    sistema: string;

    submenus: string[];

    opciones: string[];

    idMenu:string;
    
}