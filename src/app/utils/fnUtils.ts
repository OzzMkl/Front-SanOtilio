import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

// Importa el Router y el MessageService directamente aquí

export function handleRedirect(timerCounter: number, router: Router, messageService: MessageService) {
  const timerId = setInterval(() => {
    timerCounter--;
    if (timerCounter === 0) {
      clearInterval(timerId);
      router.navigate(['./']);
    }
    messageService.add({
      severity: 'error',
      summary: 'Acceso denegado',
      detail: `El usuario no cuenta con los permisos necesarios, redirigiendo en ${timerCounter} segundos`
    });
  }, 1000);
}
