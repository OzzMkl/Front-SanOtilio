import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//Servicios
import { SucursalService } from 'src/app/services/sucursal.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { TraspasoService } from 'src/app/services/traspaso.service';
//Modelos
import { Empresa } from 'src/app/models/empresa';


@Component({
  selector: 'app-traspaso-editar',
  templateUrl: './traspaso-editar.component.html',
  styleUrls: ['./traspaso-editar.component.css']
})
export class TraspasoEditarComponent implements OnInit {
  //Modelos
  public empresaSesion: Empresa = new Empresa(0,'','','','','','','','','','','','','','');
  //Datos de traspaso
  public detallesTraspaso:any;
  public productosDT:any;
  //Recive services
  public sucursales: Array<any> = [];

  constructor(
    private _sucursalService: SucursalService,
    private _empresaService: EmpresaService,
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

    /**
   * @description
   * Obtiene todas las sucursales
   */
    getSucursales(){
      this._sucursalService.getSucursales().subscribe(
        response =>{
          if(response.status == 'success'){
            this.sucursales = response.sucursales;
          }
          console.log(this.sucursales);
        }, error =>{
          console.log(error);
        });
    }
  
    /**
     * @description
     * Obtiene la empresa/sucursal en la que se esta loguedo
     */
    getEmpresa(){
      this._empresaService.getDatosEmpresa().subscribe(
        response =>{
          if(response.status == 'success'){
            this.empresaSesion = response.empresa[0];
            console.log(this.empresaSesion);
          }
        }, error =>{
          console.log(error);
        });
    }
  
    //Funciones
  
    /**
     * 
     */



}
