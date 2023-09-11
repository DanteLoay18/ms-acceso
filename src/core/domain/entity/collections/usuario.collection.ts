import { Base } from "src/core/shared/domain/base";
import { PerfilesDto } from "../perfiles.dto";

export class Usuario extends Base{


    nombres:     string;
    email:   string;
    password:   string;
    apellidos:  string;
    defaultPassword: string;
    perfiles: PerfilesDto[];
    isDefaultPassword:boolean;
    avatarText:string;

    static create(nombres: string, apellidos:string, email:string, usuarioCreacion:string){
        const usuario = new Usuario();
        const password=this.generatePassword();
        usuario.nombres=nombres.toUpperCase();
        usuario.apellidos=apellidos.toUpperCase();
        usuario.email=email;
        usuario.password=password;
        usuario.esEliminado=false;
        usuario.esBloqueado=false;
        usuario.fechaCreacion= new Date();
        usuario.usuarioCreacion= usuarioCreacion;
        usuario.avatarText= this.obtenerIniciales(nombres, apellidos);
        usuario.defaultPassword=password;
        usuario.isDefaultPassword=true;
        return usuario;
    }

    static updatePassword(password:string, usuarioModificacion:string, isDefaultPassword:boolean){
      const usuario = new Usuario();
      usuario.password=password;
      usuario.isDefaultPassword=isDefaultPassword;
      usuario.fechaModificacion=new Date();
      usuario.usuarioModificacion=usuarioModificacion;
      return usuario;
  }

  static updateUsuario(nombres:string, apellidos:string, email:string, perfiles:PerfilesDto[], usuarioModificacion:string){
    const usuario = new Usuario();
    usuario.nombres=nombres?.toUpperCase();
    usuario.apellidos=apellidos?.toUpperCase();
    usuario.email=email;
    usuario.perfiles=perfiles;
    usuario.fechaModificacion=new Date();
    usuario.usuarioModificacion=usuarioModificacion;
    if(usuario.nombres && usuario.apellidos){
      usuario.avatarText=this.obtenerIniciales(nombres, apellidos);
    }
    return usuario;
}

  static deleteUsuario( usuarioModificacion:string){
    const usuario = new Usuario();
    usuario.fechaModificacion=new Date();
    usuario.usuarioModificacion=usuarioModificacion;
    usuario.esEliminado=true;
    return usuario;
  }


    static  obtenerIniciales(nombre:string, apellido:string) {
      const inicialNombre = nombre.charAt(0).toUpperCase();
      const inicialApellido = apellido.charAt(0).toUpperCase();
      return `${inicialNombre}${inicialApellido}`;
    }
    
    static generatePassword() {
        const caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?";
        let password = "";
      
        for (let i = 0; i < 10; i++) {
          const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
          password += caracteres.charAt(indiceAleatorio);
        }
      
        return password;
    }

}