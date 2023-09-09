import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsBoolean } from "class-validator";

export class CreateMenuRequest {

    
    nombre: string;

   
    esSubmenu: boolean;
    
    usuario:string;
      

    
}