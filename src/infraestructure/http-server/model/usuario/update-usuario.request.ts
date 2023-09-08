
import { PerfilesDto } from "./perfiles.dto";

export class UpdateUsuarioRequest {
    
    id:string;
    usuario:string;
    updateUsuarioRequest:UpdateUsuarioRequestDto
    
}

export class UpdateUsuarioRequestDto{
    perfiles:PerfilesDto[];
    nombres: string;
    apellidos: string;
    email: string;
}