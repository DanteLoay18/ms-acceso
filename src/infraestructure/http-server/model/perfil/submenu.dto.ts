import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator";

export class Submenu{

    @ApiProperty({
        description: 'Opciones Perfil',
    })
    @IsOptional()
    @IsString()
    submenu:string;

    @ApiProperty({
        description: 'Opciones Perfil',
    })
    @IsOptional()
    @IsArray()
    @IsString({each:true})
    opciones:string[]
}