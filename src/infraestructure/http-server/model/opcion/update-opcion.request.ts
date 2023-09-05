import { CreateOpcionRequest } from "./create-opcion.request";
import { PartialType } from '@nestjs/swagger';

export class UpdateOpcionRequest extends PartialType(CreateOpcionRequest){}
    