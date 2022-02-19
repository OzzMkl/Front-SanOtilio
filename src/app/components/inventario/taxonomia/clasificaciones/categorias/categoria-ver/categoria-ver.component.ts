import { Component, OnInit } from '@angular/core';
import { Categoria } from 'src/app/models/categoria';
import { CategoriaService } from 'src/app/services/categoria.service';
import { global } from 'src/app/services/global';
import { Router,ActivatedRoute,Params } from '@angular/router';




@Component({
  selector: 'app-categoria-ver',
  templateUrl: './categoria-ver.component.html',
  styleUrls: ['./categoria-ver.component.css'],
  providers:[CategoriaService]
})
export class CategoriaVerComponent implements OnInit {


  public page_title: string;
  public url:string;
  public categoria: any;
  public totalPagesC: any;
  public pageC: any;
  public next_pageC: any;
  public prev_pageC: any;
  pageActualC: number = 1;
  fpv = '';

  constructor(
    private _categoriaService: CategoriaService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
      this.page_title = 'Categorias'
      this.url = global.url;
      this.categoria = [];
   }

  ngOnInit(): void {
    //this.getCate();
  }

  getCate(){
    this._categoriaService.getCategorias().subscribe(
      response =>{
        if(response.status == 'success'){
          this.categoria = response.categoria;
          //navegacion de paginacion
          //console.log(response.categoria);
        }
      },
      error =>{
        //console.log(error);
      }
    );
  }


  public fillCate(id:any){
    this._categoriaService.fillCategorias(id).subscribe(
      response =>{
        if(response.status == 'success'){
          this.categoria = response.categoria;
          //navegacion de paginacion
          //console.log(response.categoria);
        }
      },
      error =>{
        //console.log(error);
      }
    );
  }

}
