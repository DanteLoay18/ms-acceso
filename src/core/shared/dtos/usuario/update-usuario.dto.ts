import { PartialType } from "@nestjs/swagger";
import { RegisterUsuarioDto } from "./register-usuario.dto";
import { PerfilesDto } from "./perfiles.dto";


export class UpdateUsuarioDto extends PartialType(RegisterUsuarioDto){

    perfiles:PerfilesDto[];
    
}