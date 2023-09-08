import { Usuario } from "src/core/domain/entity/collections";
import { RegisterUsuarioRequest } from "./register-usuario.request";


export interface CreateUsuarioRequest{
    registerUsuarioRequest: RegisterUsuarioRequest;
    usuario:string;

}