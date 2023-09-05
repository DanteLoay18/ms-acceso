import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsBoolean } from "class-validator";

export class CreateMenuRequest {

    @ApiProperty({
        description: 'Nombre Menu',
    })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({
        description: 'Es submenu',
    })
    @IsBoolean()
    @IsNotEmpty()
    esSubmenu: boolean;
    

      

    
}