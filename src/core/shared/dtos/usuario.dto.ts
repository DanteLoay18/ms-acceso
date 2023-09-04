export class UsuarioDto{
    _id:string;
    nombres:     string;
    email:   string;
    password:   string;
    apellidos:  string;
    esEliminado:boolean;
    esBloqueado:boolean;
    fechaCreacion:Date;
    fechaModificacion:Date;
    usuarioCreacion: string;
    usuarioModificacion: string;
}