import { UpdateOpcionDto } from "src/core/shared/dtos";

export class UpdateOpcionCommand {
    
    constructor(
                public readonly id:string,
                public readonly updateOpcionDto:UpdateOpcionDto,
                public readonly usuarioDto:string
                ) { }
    
}