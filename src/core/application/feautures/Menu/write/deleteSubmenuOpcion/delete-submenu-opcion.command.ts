

export class DeleteSubmenuOpcionCommand {
    
    constructor(
                public readonly id:string,
                public readonly idOpcion:string,
                public readonly usuario:string
                ) { }
    
}