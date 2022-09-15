import { Component, OnInit } from '@angular/core';
//servicios
import { EntregasService } from 'src/app/services/entregas.service';

@Component({
  selector: 'app-entregas-pendientes',
  templateUrl: './entregas-pendientes.component.html',
  styleUrls: ['./entregas-pendientes.component.css']
})
export class EntregasPendientesComponent implements OnInit {

  public entregasPendientes:any//getEntregasPendientes()
  //spinner
  public isLoading:boolean = true;
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
  buscaNombreEmpleado='';

  constructor(private _entregasService : EntregasService) { }

  ngOnInit(): void {
    this.getEntregasPendientes()
  }

  getEntregasPendientes(){
    this._entregasService.getIndexEntregas().subscribe(
      response =>{
        if(response.status == 'success'){
          this.entregasPendientes = response.entregas
          this.isLoading = false
        }        
        //console.log(this.entregasPendientes)
      }
    )
  }
  //ponemos vacio al cambiar entre tipo de busqueda
  seleccionTipoBusqueda(e:any){
    this.buscarFolio='';
    this.buscarNomC='';
  }
}
