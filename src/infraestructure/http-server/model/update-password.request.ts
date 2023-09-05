import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdatePasswordRequest {

   
    @ApiProperty({
        description: 'Categoria id',
    })
    @IsString()
    password: string;

   
    

    
}