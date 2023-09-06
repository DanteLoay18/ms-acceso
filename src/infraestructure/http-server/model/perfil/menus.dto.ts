import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsUUID } from "class-validator";

export class MenusDto{

    @ApiProperty({
        description: 'Menu Perfil',
    })
    @IsOptional()
    @IsUUID('4', {each:true})
    menu:string;

    
    @ApiProperty({
        description: 'Opciones Perfil',
    })
    @IsOptional()
    @IsArray()
    @IsUUID('4', {each:true})
    opciones:string[]
}