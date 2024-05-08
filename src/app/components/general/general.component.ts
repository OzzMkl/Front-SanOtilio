import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedMessage } from 'src/app/services/sharedMessage';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css'],
  providers:[MessageService]
})
export class GeneralComponent implements OnInit, OnDestroy {

  private sub_whatever?: Subscription;

  constructor(
    private messageService: MessageService,
    private _sharedMessage: SharedMessage,
  ) { }

  ngOnInit(): void {
    setTimeout(()=>{
      this._sharedMessage.messages$.subscribe(
        messages =>{
          if(messages){
            this.messageService.add(messages[0]); // Agregar el mensaje al servicio de mensajes de PrimeNG
          }
        }
      )
    },500);
  }

    /**
   * @description
   * Destruimos todos los subscriptions
   */
    ngOnDestroy(): void {
      this.sub_whatever?.unsubscribe();
    }
}
