import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsUUID } from "class-validator";
import { Submenu } from "./submenu.dto";

export class MenusDto{

    @ApiProperty({
        description: 'Menu Perfil',
    })
    @IsOptional()
    @IsUUID('4')
    menu:string;

    
    @ApiProperty({
        description: 'Opciones Perfil',
    })
    @IsOptional()
    @IsArray()
    submenus:Submenu[]
}