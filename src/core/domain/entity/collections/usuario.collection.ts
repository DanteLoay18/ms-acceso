

export class Usuario{
    _id:        string;
    nombres:     string;
    email:   string;
    password:   string;
    apellidos:  string;
    esEliminado:boolean;

    static create(nombres: string, apellidos:string, email:string, password:string){
        const usuario = new Usuario();
        usuario.nombres=nombres;
        usuario.apellidos=apellidos;
        usuario.email=email;
        usuario.password=password;
        usuario.esEliminado=false;
        
        return usuario;
    }
}