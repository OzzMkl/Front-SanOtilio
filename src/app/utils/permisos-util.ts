import { MessageService } from 'primeng/api';


export function validaPermiso(user:any ,modulosService:any, messageService:MessageService): boolean {
    /**
     * Bucamos en los permisos guardados en el navegador el modulo y 
     * su submodulo si lo encuentra este ingresa al modulo
     */
    const userPermi = user.permisos.find(
      (x: any) => x.idModulo == modulosService.idModulo && x.idSubModulo == modulosService.idSubModulo
    );

    if (userPermi == undefined) {
        messageService.add({
                severity:'error', 
                summary:'Acceso denegado', 
                detail: 'El usuario no cuenta con los permisos necesarios'
            });

      return false;
    } else {
      return true;
    }
}
