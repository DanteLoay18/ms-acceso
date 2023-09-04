import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsBoolean } from "class-validator";

export class RegisterUsuarioRequest {

    @ApiProperty({
        description: 'Categoria id',
    })
    @IsString()
    nombres: string;
   
    @ApiProperty({
        description: 'Categoria Name',
    })
    @IsString()
    apellidos: string;

    @ApiProperty({
        description: 'Categoria id',
    })
    @IsString()
    email: string;

    @ApiProperty({
        description: 'Categoria id',
    })
    @IsString()
    password: string;
    // @ApiProperty({
    //     description: 'Categoria Description',
    // })
    // @IsBoolean()
    // activo:boolean;

    

    
}