

export class UpdateUsuarioPasswordCommand {
    
    constructor(
                public readonly id:string,
                public readonly password:string,
                public readonly confirmationPassword:string,
                public readonly usuarioDto:string
                ) { }
    
}