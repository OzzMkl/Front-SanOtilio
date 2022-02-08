import { Component, OnInit } from '@angular/core';
import { Proveedor } from 'src/app/models/proveedor';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Banco } from 'src/app/models/banco';
import { BancoService } from 'src/app/services/banco.service';
import {ToastService} from 'src/app/services/toast.service';

@Component({
  selector: 'app-proveedor-agregar',
  templateUrl: './proveedor-agregar.component.html',
  styleUrls: ['./proveedor-agregar.component.css'],
  providers:[ProveedorService,BancoService]  
})
export class ProveedorAgregarComponent implements OnInit {

  public proveedor: Proveedor;
  public banco: Array<Banco>;
  
  public page_title: string;
  public page_contacto: string;
  public page_cuenta: string;
  public page_proveedor: string;
  public status: string;
  
  
  constructor(
    private _proveedorService: ProveedorService,
    private _bancoService: BancoService,
    private _router: Router,
    private _route: ActivatedRoute,
    public toastService: ToastService

  ) {
      this.proveedor = new Proveedor (0,'','','','','','','','','','',0,0,1,'','','','','','','','','');    
      this.banco = [];
      this.page_title = 'Agregar un proveedor';
      this.page_contacto = 'Datos del contacto';
      this.page_cuenta = 'Datos de la cuenta';
      this.page_proveedor = 'Datos del proveedor';
      this.status = '';
   }

  ngOnInit(): void {
    this.getBanco(); 

  }
  onSubmit(form:any){
    //console.log(this.proveedor);
    this._proveedorService.register(this.proveedor).subscribe(
      response =>{ 
        console.log(response);
        this.toastService.show('Proveedor guardado correctamente', { classname: 'bg-success text-light', delay: 5000 }); 
        form.reset();  },
      error => {
        this.toastService.show('Ups... Algo salio mal', { classname: 'bg-danger text-light', delay: 15000 });
        console.log(<any>error);
      }
    )
  }

  getBanco(){
    //console.log(this.banco);
    this._bancoService.getBancos().subscribe(
      response =>{
        if(response.status == 'success'){
          this.banco = response.proveedores;
          console.log(response.proveedores);
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

}
