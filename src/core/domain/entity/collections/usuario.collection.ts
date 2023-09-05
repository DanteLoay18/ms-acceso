import { Base } from "src/core/shared/domain/base";


export class Usuario extends Base{


    nombres:     string;
    email:   string;
    password:   string;
    apellidos:  string;
    defaultPassword: string;
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
        usuario.fechaModificacion=new Date();
        usuario.usuarioCreacion= usuarioCreacion;
        usuario.usuarioModificacion=usuarioCreacion;
        usuario.avatarText= this.obtenerIniciales(nombres);
        usuario.defaultPassword=password;
        usuario.isDefaultPassword=true;
        return usuario;
    }

    static updatePassword(password:string, usuarioModificacion:string){
      const usuario = new Usuario();
      usuario.password=password;
      usuario.isDefaultPassword=false;
      usuario.fechaModificacion=new Date();
      usuario.usuarioModificacion=usuarioModificacion;
      return usuario;
  }

    static obtenerIniciales(nombreCompleto:string) {
        const palabras = nombreCompleto.split(" ");
        let iniciales = "";
      
        for (let i = 0; i < 2 && i < palabras.length; i++) {
          const palabra = palabras[i];
          if (palabra.length > 0) {
            iniciales += palabra[0].toUpperCase();
          }
        }
      
        return iniciales;
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