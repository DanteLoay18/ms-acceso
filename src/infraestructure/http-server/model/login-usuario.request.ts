import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsBoolean } from "class-validator";

export class LoginUsuarioRequest {

   
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
   
    

    
}