import { Component, OnInit } from '@angular/core';
//Servicios
import { VentasService } from 'src/app/services/ventas.service';

@Component({
  selector: 'app-ventas-realizadas',
  templateUrl: './ventas-realizadas.component.html',
  styleUrls: ['./ventas-realizadas.component.css']
})
export class VentasRealizadasComponent implements OnInit {

  //variables servicios
  public ventas:any;
  //spinner de carga
  public isLoading:boolean = false;
  //paginator
  public totalPages:any;
  public page:any;
  public next_page:any;
  public prev_page:any;
  public pageActual:any;
  //pipe
  tipoBusqueda:number = 1;
  buscaFolio=''
  buscaNombreCliente='';
  buscaNombreEmpleado='';

  constructor( private _ventasService: VentasService) { }

  ngOnInit(): void {
    this.getVentas();
  }
  getVentas(){
    this.isLoading = true;
    this._ventasService.getIndexVentas().subscribe(
      response =>{
        if(response.status == 'success'){
          this.ventas = response.Ventas
          this.isLoading = false;
        }
      }, error =>{
        console.log(error);
      }
    )
  }
  //ponemos vacio al cambiar entre tipo de busqueda
  seleccionTipoBusqueda(e:any){
    this.buscaFolio='';
    this.buscaNombreCliente='';
    this.buscaNombreEmpleado='';
  }

}
