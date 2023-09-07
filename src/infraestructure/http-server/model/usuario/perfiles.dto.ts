import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";


export class PerfilesDto{
    @ApiProperty({
        description: 'Nombre Usuario',
    })
    @IsString()
    @IsOptional()
    perfil:string;


    @ApiProperty({
        description: 'Nombre Usuario',
    })
    @IsBoolean()
    @IsOptional()
    activo:boolean;


}
