import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsBoolean } from "class-validator";

export class CreateOpcionRequest {

    @ApiProperty({
        description: 'Nombre Opcion',
    })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({
        description: 'Icono Opcion',
    })
    @IsString()
    @IsNotEmpty()
    icono: string;

    @ApiProperty({
        description: 'tiene Opciones',
    })
    @IsBoolean()
    @IsNotEmpty()
    tieneOpciones:boolean;
 
    @ApiProperty({
        description: 'es Emergente Opcion',
    })
    @IsBoolean()
    @IsNotEmpty()
    esEmergente:boolean;

      

    
}