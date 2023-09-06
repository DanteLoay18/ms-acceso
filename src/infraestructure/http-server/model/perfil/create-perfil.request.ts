import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsBoolean } from "class-validator";

export class CreatePerfilRequest {

    @ApiProperty({
        description: 'Tipo Perfil',
    })
    @IsString()
    @IsNotEmpty()
    tipo: string;



      

    
}