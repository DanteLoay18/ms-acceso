

export class DeleteUsuarioCommand {
    
    constructor(
                public readonly id:string,
                public readonly usuario:string
                ) { }
    
}