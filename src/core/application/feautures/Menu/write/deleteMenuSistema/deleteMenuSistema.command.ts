

export class DeleteMenuSistemaCommand {
    
    constructor(
                public readonly id:string,
                public readonly idSistema:string,
                public readonly usuario:string
                ) { }
    
}