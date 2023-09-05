import { RegisterUsuarioRequest } from "./register-usuario.request";
import { PartialType } from '@nestjs/swagger';

export class UpdateUsuarioRequest extends PartialType(RegisterUsuarioRequest){}
    