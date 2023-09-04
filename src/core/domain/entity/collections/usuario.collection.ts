import { Base } from "src/core/shared/domain/base";


export class Usuario extends Base{


    nombres:     string;
    email:   string;
    password:   string;
    apellidos:  string;
    

    static create(nombres: string, apellidos:string, email:string, password:string, usuarioCreacion:string){
        const usuario = new Usuario();
        usuario.nombres=nombres;
        usuario.apellidos=apellidos;
        usuario.email=email;
        usuario.password=password;
        usuario.esEliminado=false;
        usuario.esBloqueado=false;
        usuario.fechaCreacion= new Date();
        usuario.fechaModificacion=new Date();
        usuario.usuarioCreacion= usuarioCreacion;
        usuario.usuarioModificacion=usuarioCreacion;
        return usuario;
    }
}