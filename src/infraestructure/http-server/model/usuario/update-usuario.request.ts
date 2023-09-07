
import { RegisterUsuarioRequest } from "./register-usuario.request";
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsOptional } from "class-validator";
import { PerfilesDto } from "./perfiles.dto";

export class UpdateUsuarioRequest extends PartialType(RegisterUsuarioRequest){
    
    
    @ApiProperty({
        description: 'Nombre Usuario',
    })
    @IsArray()
    @IsOptional()
    perfiles:PerfilesDto[];
}
    