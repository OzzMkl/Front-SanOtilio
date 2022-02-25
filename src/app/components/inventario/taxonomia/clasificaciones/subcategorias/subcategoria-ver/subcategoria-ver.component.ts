import { Component, OnInit } from '@angular/core';
import { Subcategoria } from 'src/app/models/subcategoria';
import { global } from 'src/app/services/global';
import { SubCategoriaService } from 'src/app/services/subcategoria.service';
import { Router,ActivatedRoute,Params } from '@angular/router';

@Component({
  selector: 'app-subcategoria-ver',
  templateUrl: './subcategoria-ver.component.html',
  styleUrls: ['./subcategoria-ver.component.css'],
  providers:[SubCategoriaService]
})
export class SubcategoriaVerComponent implements OnInit {

  public page_title: string;
  public url:string;
  public subcategoria: any;
  public totalPages: any;
  public page: any;
  public next_page: any;
  public prev_page: any;
  pageActual: number = 1;
  fpv = '';

  constructor(
    private _proveedorService: SubCategoriaService,
    private _route: ActivatedRoute,
    private _router: Router

  ) {
      this.page_title = 'SubCategoria'
      this.url = global.url;
      this.subcategoria = [];
   }

  ngOnInit(): void {
    //this.getSubCat();
  }

  getSubCat(){
    this._proveedorService.getSubCategorias().subscribe(
      response =>{
        if(response.status == 'success'){
          this.subcategoria = response.subcategoria;
          //navegacion de paginacion
          
          console.log(response.subcategoria);
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

}
