import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginUsuarioRequest {

   
    @ApiProperty({
        description: 'Email Usuario',
    })
    @IsString()
    email: string;

    @ApiProperty({
        description: 'Password Usuario',
    })
    @IsString()
    password: string;
   
    

    
}