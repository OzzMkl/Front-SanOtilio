import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { Medida } from 'src/app/models/medida';
import { global } from 'src/app/services/global';
import { MedidaService } from 'src/app/services/medida.service';

@Component({
  selector: 'app-medida-ver',
  templateUrl: './medida-ver.component.html',
  styleUrls: ['./medida-ver.component.css'],
  providers:[MedidaService]
})
export class MedidaVerComponent implements OnInit {

  
  public url:string;
  public medidas: any;
  public totalPages: any;
  public page: any;
  public next_page: any;
  public prev_page: any;
  pageActual: number = 1;
  fpv = '';


  constructor(

    private _proveedorService: MedidaService,
    private _route: ActivatedRoute,
    private _router: Router

  ) {
      
      this.url = global.url;
      this.medidas = [];
   }

  ngOnInit(): void {
    this.getMedida();
  }

  getMedida(){
    this._proveedorService.getMedidas().subscribe(
      response =>{
        if(response.status == 'success'){
          this.medidas = response.medidas;
          //navegacion de paginacion
          
          console.log(response.medidas);

        }
      },
      error =>{
        console.log(error);
      }
    );
  }
}
