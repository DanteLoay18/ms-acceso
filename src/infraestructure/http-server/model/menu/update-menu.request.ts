import { IsArray, IsOptional, IsString, IsUUID } from "class-validator";
import { CreateMenuRequest } from "./create-menu.request";
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class UpdateMenuRequest extends PartialType(CreateMenuRequest){
    
    @ApiProperty({
        description: 'Sistema',
    })
    @IsOptional()
    @IsUUID('4')
    sistema: string;

    @ApiProperty({
        description: 'Submenus',
    })
    @IsArray()
    @IsOptional()
    @IsUUID('4',{ each: true }) 
    //TODO:AGREGAR EL ISUUID()
    submenus: string[];

    @ApiProperty({
        description: 'Opciones Menu',
    })
    @IsArray()
    @IsOptional()
    @IsUUID('4', { each: true })
    
    opciones: string[];

}
    