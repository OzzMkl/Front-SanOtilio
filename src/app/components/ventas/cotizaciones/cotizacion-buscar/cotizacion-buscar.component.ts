import { Component, OnInit } from '@angular/core';
//Servicios
import { VentasService } from 'src/app/services/ventas.service';

@Component({
  selector: 'app-cotizacion-buscar',
  templateUrl: './cotizacion-buscar.component.html',
  styleUrls: ['./cotizacion-buscar.component.css']
})
export class CotizacionBuscarComponent implements OnInit {

  //variable servicios
  public cotizaciones:any;
  //paginador
  public totalPages:any;
  public page:any;
  public next_page:any;
  public prev_page:any;
  public pageActual:any;
  //pipe
  tipoBusqueda: number = 1;
  buscarNomC ='';
  buscarFolio='';
  
  constructor( private _ventasService: VentasService) { }

  ngOnInit(): void {
    this.getCotizaciones();
  }

  getCotizaciones(){
    this._ventasService.getIndexCotiza().subscribe( 
      response =>{
        if(response.status == 'success'){
          this.cotizaciones = response.Cotizaciones;
          console.log(this.cotizaciones);
        }
      },error=>{
        console.log(error)
      });
  }
  seleccionTipoBusqueda(e:any){
    this.buscarFolio='';
    this.buscarNomC='';
  }

}
