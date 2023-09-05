import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail } from "class-validator";

export class RegisterUsuarioRequest {

    @ApiProperty({
        description: 'Nombre Usuario',
    })
    @IsString()
    nombres: string;
   
    @ApiProperty({
        description: 'Apellidos Usuario',
    })
    @IsString()
    apellidos: string;

    @ApiProperty({
        description: 'Email Usuario',
    })
    @IsString()
    @IsEmail()
    email: string;

      

    
}