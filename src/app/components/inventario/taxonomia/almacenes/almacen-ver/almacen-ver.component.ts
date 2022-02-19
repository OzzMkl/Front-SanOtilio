import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { Almacen } from 'src/app/models/almacen';
import { AlmacenService } from 'src/app/services/almacen.service';
import { global } from 'src/app/services/global';


@Component({
  selector: 'app-almacen-ver',
  templateUrl: './almacen-ver.component.html',
  styleUrls: ['./almacen-ver.component.css'],
  providers:[AlmacenService]
})
export class AlmacenVerComponent implements OnInit {

  public page_title: string;
  public url:string;
  public almacenes: any;
  public totalPages: any;
  public page: any;
  public next_page: any;
  public prev_page: any;
  pageActual: number = 1;
  fpv = '';

  constructor(

    private _proveedorService: AlmacenService,
    private _route: ActivatedRoute,
    private _router: Router

  ) {
      this.page_title = 'Almacen'
      this.url = global.url;
      this.almacenes = [];
   }

   ngOnInit(): void {
    this.getAlmacenes();
  }

  getAlmacenes(){
    this._proveedorService.getAlmacenes().subscribe(
      response =>{
        if(response.status == 'success'){
          this.almacenes = response.almacenes;
          //navegacion de paginacion
          
          //console.log(response.almacenes);
        }
      },
      error =>{
        //console.log(error);
      }
    );
  }

}
