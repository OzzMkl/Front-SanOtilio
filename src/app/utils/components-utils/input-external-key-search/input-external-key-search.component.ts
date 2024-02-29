import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { SharedMessage } from 'src/app/services/sharedMessage';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-input-external-key-search',
  templateUrl: './input-external-key-search.component.html',
  styleUrls: ['./input-external-key-search.component.css'],
  providers: [ProductoService]
})
export class InputExternalKeySearchComponent implements OnInit, OnDestroy {

  //Valor del producto buscado en getIdProductByEventEnter
  public idProducto?: number;
  //El ! indica que serea inicializado antes de usarse
  private sub_productoService: Subscription = new Subscription();
  //Variable encargada de enviar el valor del id
  @Output() idProductoObtenido: EventEmitter<number> = new EventEmitter<number>();
  //Variable encargada de recibir el valor de claveEx desde el componente padre
  @Input() claveExterna?: string;

  constructor(
    private _productoService: ProductoService,
    private _sharedMessage:SharedMessage,
  ) { }

  ngOnInit(): void {
  }

  /**
   * 
   * @param event type Event
   * @description
   * Obtenemos el idProducto al escribir la claveEx del producto
   * en el input y dar "Enter"
   */
  getIdProductByEventEnter(event: Event){
    //Convertimos el evento a KevyboardEvent
    const kbEvent = event as KeyboardEvent;
    //Si la tecla precionda fue "Enter"
      if(kbEvent.key == 'Enter'){
        //asignamos el valor
        let valInput = (event.target as HTMLInputElement).value;
        //Comprobamos que no venga vacio
        if(valInput){
          //Ejecutamos servicio
          this.sub_productoService =this._productoService.getIdProductByClaveEx(valInput).subscribe(
            response =>{
              // console.log(response);
              if(response.code == 200 && response.status == 'success'){
                this.idProducto = response.idProducto;
                this.idProductoObtenido.emit(this.idProducto);
                // console.log(this.idProducto)
              }
            }, error =>{
              if(error.error){
                this._sharedMessage.addMessages({
                  severity:'error',
                  summary: error.error.message, 
                  detail: ''
                });
                this.idProductoObtenido.emit(undefined);
              }
              console.log(error);
            });
        }//ofvalinput
      }//ifkbEnter
  }//fin fn()

  ngOnDestroy(): void {
    this.sub_productoService.unsubscribe();
  }

}