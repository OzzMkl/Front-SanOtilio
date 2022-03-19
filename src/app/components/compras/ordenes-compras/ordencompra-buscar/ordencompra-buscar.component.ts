import { Component, OnInit } from '@angular/core';
//Servicio
import { OrdendecompraService } from 'src/app/services/ordendecompra.service';
import { global } from 'src/app/services/global';
//router
import { Router } from '@angular/router';

@Component({
  selector: 'app-ordencompra-buscar',
  templateUrl: './ordencompra-buscar.component.html',
  styleUrls: ['./ordencompra-buscar.component.css'],
  providers:[OrdendecompraService]
})
export class OrdencompraBuscarComponent implements OnInit {

  constructor( private _ordendecompraService: OrdendecompraService, private _router: Router) { }

  public page_title: string = 'Ordenes de compra por recibir';
  //Variables de servicios
  public ordenesdecompra: any = [];
  public url: string = global.url;
  /**PAGINATOR */
  public totalPages: any;
  public page: any;
  public next_page: any;
  public prev_page: any;
  pageActual: number = 1;
  //
  foc='';
  datox='';


  ngOnInit(): void {
    this.getAllOrdenes();
  }
  getAllOrdenes(){
    this._ordendecompraService.getAllOrders().subscribe(
      response =>{
        if(response.status == 'success'){
          this.ordenesdecompra = response.ordencompra;
          //console.log(this.ordenesdecompra);
        }else{
          console.log('Algo salio mal');
        }
      },error =>{
        console.log(error);
      });
  }
  selected(dato:any){
    this.datox = dato;
    this._router.navigate(['./producto-modulo/producto-ver/'+this.datox]);
  }

}
