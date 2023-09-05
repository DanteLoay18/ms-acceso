import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsBoolean } from "class-validator";

export class CreateSistemaRequest {

    @ApiProperty({
        description: 'Nombre Sistema',
    })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({
        description: 'Url Sistema',
    })
    @IsString()
    @IsNotEmpty()   
    url: string;

    @ApiProperty({
        description: 'Imagen Sistema',
    })
    @IsString()
    @IsNotEmpty() 
    imagen: string;

    @ApiProperty({
        description: 'Puerto Sistema',
    })
    @IsString()
    @IsNotEmpty() 
    puerto: string;

      

    
}