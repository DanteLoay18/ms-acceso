import { IsArray, IsOptional, IsString, IsUUID } from "class-validator";
import { MenusDto } from "./menus.dto";
import { ApiProperty } from "@nestjs/swagger";

export class SistemasDto{

    @ApiProperty({
        description: 'Sistema Perfil',
    })
    @IsOptional()
    @IsUUID('4', {each:true})
    sistema: string;

    @ApiProperty({
        description: 'Menus Perfil',
    })
    @IsOptional()
    @IsArray()
    menus: MenusDto[];

}