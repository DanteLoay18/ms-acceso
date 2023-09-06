import { PartialType } from "@nestjs/swagger";
import { CreatePerfilDto } from "./create-perfil.dto";
import { SistemasDto } from "src/core/domain/entity/sistemas.dto";

export class UpdatePerfilDto extends PartialType(CreatePerfilDto){

    sistemas:SistemasDto[];
    
}