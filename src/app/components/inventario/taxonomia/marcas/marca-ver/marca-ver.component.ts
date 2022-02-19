import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { Marca } from 'src/app/models/marca';
import { global } from 'src/app/services/global';
import { MarcaService } from 'src/app/services/marca.service';


@Component({
  selector: 'app-marca-ver',
  templateUrl: './marca-ver.component.html',
  styleUrls: ['./marca-ver.component.css'],
  providers:[MarcaService]
})
export class MarcaVerComponent implements OnInit {

  public page_title: string;
  public url:string;
  public marca: any;
  public totalPages: any;
  public page: any;
  public next_page: any;
  public prev_page: any;
  pageActual: number = 1;
  fpv = '';

  constructor(

    private _proveedorService: MarcaService,
    private _route: ActivatedRoute,
    private _router: Router

  ) {

      this.page_title = 'Marcas'
      this.url = global.url;
      this.marca = [];

   }

  ngOnInit(): void {
    this.getMarca();
  }

  getMarca(){
    this._proveedorService.getMarcas().subscribe(
      response =>{
        if(response.status == 'success'){
          this.marca = response.marca;
          //navegacion de paginacion
          
          //console.log(response.marca);
        }
      },
      error =>{
        //console.log(error);
      }
    );
  }

}
