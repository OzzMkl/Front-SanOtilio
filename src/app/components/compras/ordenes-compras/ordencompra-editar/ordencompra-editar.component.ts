import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//Servicios
import { ProveedorService } from 'src/app/services/proveedor.service';
import { ProductoService } from 'src/app/services/producto.service';
import { global } from 'src/app/services/global';
import { ToastService } from 'src/app/services/toast.service';
import { OrdendecompraService } from 'src/app/services/ordendecompra.service';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-ordencompra-editar',
  templateUrl: './ordencompra-editar.component.html',
  styleUrls: ['./ordencompra-editar.component.css'],
  providers:[ProveedorService,ProductoService, OrdendecompraService, EmpleadoService]
})
export class OrdencompraEditarComponent implements OnInit {

//variables servicios
public url: string = global.url;

  constructor(
    //declaracion de servicios
    private _proveedorService: ProveedorService,
    private _productoService: ProductoService,
    public toastService: ToastService,
    private _ordencompraService: OrdendecompraService,
    public _empleadoService : EmpleadoService,
    private _route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
  }
  getOrdencompra(){
    this._route.params.subscribe( params =>{
      let id = + params['idOrd'];

      this._ordencompraService
    });
  }

}
