
import { PartialType } from '@nestjs/swagger';
import { CreateSistemaRequest } from "./create-sistema.request";

export class UpdateSistemaRequest extends PartialType(CreateSistemaRequest){}
    