
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePerfilRequest } from "./create-perfil.request";
import { IsArray, IsOptional } from 'class-validator';
import { SistemasDto } from './sistemas.dto';

export class UpdatePerfilRequest extends PartialType(CreatePerfilRequest){


    @ApiProperty({
        description: 'Menus Perfil',
    })
    @IsOptional()
    @IsArray()
    sistemas:SistemasDto[];

}
    