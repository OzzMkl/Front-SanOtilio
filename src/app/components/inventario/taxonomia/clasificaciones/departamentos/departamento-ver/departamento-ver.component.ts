import { Component, OnInit, ViewChildren } from '@angular/core';
import { Departamento } from 'src/app/models/departamento';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { global } from 'src/app/services/global';

import { Router,ActivatedRoute,Params } from '@angular/router';

import { Categoria } from 'src/app/models/categoria';
import { CategoriaService } from 'src/app/services/categoria.service';
import { Categoria } from 'src/app/models/categoria';
import { CategoriaVerComponent } from '../../categorias/categoria-ver/categoria-ver.component';

@Component({
  selector: 'app-departamento-ver',
  templateUrl: './departamento-ver.component.html',
  styleUrls: ['./departamento-ver.component.css'],
  providers:[DepartamentoService, CategoriaService]
})
export class DepartamentoVerComponent implements OnInit {

  public page_title: string;
  public url:string;
  public departamentos: any;
  public totalPages: any;
  public page: any;
  public next_page: any;
  public prev_page: any;
  public findCat :any;
  pageActual: number = 1;
  fpv = '';
  datox:any;

  public categoria: any;

  constructor(
    private _departamentoService: DepartamentoService,
    private _categoriaService: CategoriaService,
    private _route: ActivatedRoute,
    private _router: Router

  ) {
    this.page_title = ''
    this.url = global.url;
    this.departamentos = [];
    this.categoria = [];

   }

  ngOnInit(): void {
    this.getDept();

  }

  getDept(){
    this._departamentoService.getDepartamentos().subscribe(
      response =>{
        if(response.status == 'success'){
          this.departamentos = response.departamentos;
          this.getCate
          //navegacion de paginacion
          this.totalPages = response.departamentos;
          console.log(this.totalPages.length);

        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  onFocusEvent(event: any){
    //event.srcElement.style.background = "red";
    console.log(event.path[0].innerText);
    this.findCat = event.path[0].innerText;
    

    //.fillCate();

    
    // this._categoriaService.fillCategorias(event.path[0].innerText).subscribe(
    //   response =>{
    //     if(response.status == 'success'){
    //       this.departamentos = response.departamentos;
    //       //navegacion de paginacion
    //       //this.totalPages = response.departamentos.total;
    //       console.log(response.departamentos);
    //     }
    //   },
    //   error =>{
    //     console.log(error);
    //   }
    // );
 }

 selected(dato:any){
  this.datox = dato;
  //this._router.navigate(['./producto-modulo/producto-ver/'+this.datox]);
  }

  getCate(){
    this._categoriaService.getCategorias().subscribe(
      response =>{
        if(response.status == 'success'){
          this.categoria = response.categoria;
          //navegacion de paginacion
          console.log(response.categoria);
        }
      },
      error =>{
        //console.log(error);
      }
    );
  }
  this._router.navigate(['./producto-modulo/producto-ver/'+this.datox]);
}


}

