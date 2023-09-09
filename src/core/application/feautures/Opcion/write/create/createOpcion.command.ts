import { CreateOpcionDto } from "src/core/shared/dtos";

export class CreateOpcionCommand {
    
    constructor(
                public readonly createOpcionDto: CreateOpcionDto,
                public readonly usuarioDto:string
                ) { }
    
}