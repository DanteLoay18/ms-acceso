import { PartialType } from "@nestjs/swagger";
import { RegisterUsuarioDto } from "./register-usuario.dto";


export class UpdateUsuarioDto extends PartialType(RegisterUsuarioDto){

    
}