import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsNotEmpty } from "class-validator";

export class RegisterUsuarioRequest {

    @ApiProperty({
        description: 'Nombre Usuario',
    })
    @IsString()
    @IsNotEmpty()
    nombres: string;
   
    @ApiProperty({
        description: 'Apellidos Usuario',
    })
    @IsString()
    @IsNotEmpty()
    apellidos: string;

    @ApiProperty({
        description: 'Email Usuario',
    })
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

      

    
}