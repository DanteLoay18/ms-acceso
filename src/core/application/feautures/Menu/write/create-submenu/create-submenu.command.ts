import { CreateSubmenuDto, } from "src/core/shared/dtos";

export class CreateSubmenuCommand {
    
    constructor(
                public readonly createSubmenuDto: CreateSubmenuDto,
                public readonly usuarioDto:string
                ) { }
    
}