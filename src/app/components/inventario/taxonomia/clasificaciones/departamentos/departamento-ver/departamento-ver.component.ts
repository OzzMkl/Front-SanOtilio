import { Component, OnInit, ViewChildren } from '@angular/core';
import { Departamento } from 'src/app/models/departamento';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { global } from 'src/app/services/global';

import { Router,ActivatedRoute,Params } from '@angular/router';

import { CategoriaService } from 'src/app/services/categoria.service';
import { SubCategoriaService } from 'src/app/services/subcategoria.service';

@Component({
  selector: 'app-departamento-ver',
  templateUrl: './departamento-ver.component.html',
  styleUrls: ['./departamento-ver.component.css'],
  providers:[DepartamentoService, CategoriaService,SubCategoriaService]
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
  datoy:any;
  Tcate : string ='';
  Tsubcate : string = '';

  public categoria: any;
  public subCategoria: any;
  public long: any;

  constructor(
    private _departamentoService: DepartamentoService,
    private _categoriaService: CategoriaService,
    private _subcategoriaService : SubCategoriaService,
    private _route: ActivatedRoute,
    private _router: Router

  ) {
    this.page_title = ''
    this.url = global.url;
    this.departamentos = [];
    this.categoria = [];
    this.subCategoria = [];
    this.long = [];
    this.Tcate = 'Categorías';
    this.Tsubcate = 'Subcategorías';

   }

  ngOnInit(): void {
    this.getDept();
    //this.getLong();

  }
  

  getDept(){
    this._departamentoService.getDepartamentos().subscribe(
      response =>{
        if(response.status == 'success'){
          this.departamentos = response.departamentos;
          console.log(this.departamentos);

          this._departamentoService.getLongitud().subscribe(
            response =>{
              if(response.status == 'success'){
                this.long = response.long;
                
                

                  
          for(let i = 0; i < this.departamentos.length; i++){///
            let j = 0
            if(this.departamentos[i]['idDep'] == this.long[j]['idDep']){
              j++
              this.departamentos[i].longitud = this.long[i]['longitud']
            }else{
              this.departamentos[i].longitud = 0;
            }
          }/////


              }
            },
            error =>{
              //console.log(error);
            }
          );

          

        }
        
      },
      error =>{
        //console.log(error);
      }
    );
    return this.departamentos;
  }
  
  getLong(){
    this._departamentoService.getLongitud().subscribe(
      response =>{
        if(response.status == 'success'){
          this.long = response.long;
          console.log(this.long);          
        }
      },
      error =>{
        //console.log(error);
      }
    );
  }

  //Evento al hacer clic en Departamentos
  selected(dato:any,dato2:any){
    this.datox = dato;
    //console.log(this.datox);
    this.fillCate(this.datox);
    this.Tcate = 'Categorías de ' + dato2;
    
  }

  //Evento al hacer clic en Categorias
  selectedCat(dato:any,dato2:any){
    this.datoy = dato;
    //console.log(this.datoy);
    this.fillSubCate(this.datoy);
    this.Tsubcate = 'Subcategorías de ' + dato2;
  }

  public fillCate(id:any){
    this._categoriaService.fillCategorias(id).subscribe(
      response =>{
        if(response.status == 'success'){
          this.categoria = response.gid;
        }
      },
      error =>{
        //console.log(error);
      }
      );
  }

  public fillSubCate(id:any){
    this._subcategoriaService.fillSubCategorias(id).subscribe(
      response =>{
        if(response.status == 'success'){
          this.subCategoria = response.gisc;
          //navegacion de paginacion
          //console.log(response.gisc);
        }
      },
      error =>{
        //console.log(error);
      }
    );
  }

}