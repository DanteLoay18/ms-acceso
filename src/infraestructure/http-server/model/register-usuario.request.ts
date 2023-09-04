import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsBoolean, IsEmail } from "class-validator";

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
    @IsEmail()
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