import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//Servicios
import { TraspasoService } from 'src/app/services/traspaso.service';

@Component({
  selector: 'app-traspaso-editar',
  templateUrl: './traspaso-editar.component.html',
  styleUrls: ['./traspaso-editar.component.css']
})
export class TraspasoEditarComponent implements OnInit {
  //Datos de traspaso
  public detallesTraspaso:any;
  public productosDT:any;

  constructor(
    private _route: ActivatedRoute,
    private _traspasoService: TraspasoService

  ) { }

  ngOnInit(): void {
    this.getDatosRuta();
  }

  getDatosRuta(){
    this._route.params.subscribe( params =>{
      let idTraspaso:number = params['idTraspaso'];//la asignamos en una variable
      let tipoTraspaso:string = params['tipoTraspaso'];//la asignamos en una variable
      // console.log(params);
      // console.log(idTraspaso);
      // console.log(tipoTraspaso);
      this.getDetailsTraspaso(idTraspaso,tipoTraspaso);
    });
  }

  getDetailsTraspaso(idTraspaso:any,tipoTraspaso:any){
    //console.log(idTraspaso);
    //console.log(tipoTraspaso);
    this._traspasoService.getDetailsTraspaso(idTraspaso,tipoTraspaso).subscribe(
      response =>{
        if(response.status == 'success'){
          this.detallesTraspaso = response.traspaso; 
          this.productosDT = response.productos;
          //console.log('response',response);
          console.log('traspaso',this.detallesTraspaso);
          console.log('productos',this.productosDT);

        }else{ console.log('Algo salio mal'); }
        
      },error => {
        console.log(error);
      });
  }

  

}
