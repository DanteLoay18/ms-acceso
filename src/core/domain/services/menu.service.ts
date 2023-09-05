
import { Menu } from "../entity/collections";
import { MenuRepository } from "../ports/outbound";


export class MenuService{
    
    constructor(private readonly menuRepository:MenuRepository){}

    findAll(){
       return this.menuRepository.findAll();
    }

    findOneById(id:string){
        return this.menuRepository.findOneById(id);
    }
    
    findOneByNombre(nombre:string){
        return this.menuRepository.findByNombre(nombre);
    }

    createMenu(opcion:Menu){
        return this.menuRepository.createMenu(opcion);
    }

    updateMenu(id:string,opcion:Menu){
        return this.menuRepository.updateMenu(id,opcion);
    }

    deleteMenu(id:string){
        return this.menuRepository.deleteMenu(id);
    }

    bloquearMenu(id:string, esBloqueado:boolean){
        return this.menuRepository.actualizarBloqueo(id, esBloqueado);
    }

}