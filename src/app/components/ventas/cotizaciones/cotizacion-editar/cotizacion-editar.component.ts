import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//servicios
import { ClientesService } from 'src/app/services/clientes.service';
import { ToastService } from 'src/app/services/toast.service';
import { ProductoService } from 'src/app/services/producto.service';
import { VentasService } from 'src/app/services/ventas.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { EmpresaService } from 'src/app/services/empresa.service';
//modelos
import { Cotizacion } from 'src/app/models/cotizacion';

@Component({
  selector: 'app-cotizacion-editar',
  templateUrl: './cotizacion-editar.component.html',
  styleUrls: ['./cotizacion-editar.component.css'],
  providers:[ProductoService]
})
export class CotizacionEditarComponent implements OnInit {

  constructor( private _clienteService: ClientesService, public toastService: ToastService,
               private _productoService: ProductoService, private _ventasService: VentasService,
               private _empleadoService: EmpleadoService, private _empresaService: EmpresaService,
               private _route: ActivatedRoute ) {
                 this.cotizacion_editada = new Cotizacion(0,0,'',0,0,'',0,0,0,'');
               }

  //variables servicios
  public cotizacion_editada: Cotizacion;//getDetallesCotiza
  public productos_cotizacion_e: any;//getDetallesCotiza
  public empresa:any;//getDatosempresa
  public clientes:any;
  public cliente:any;//getDetallesCliente
  //Variables html
  public seEnvia: boolean = false;
  //spinners
  public isLoadingClientes: boolean = false;

  ngOnInit(): void {
    this.getDatosEmpresa();
    this.getDetallesCotiza();
  }
  //TRAEMOS LOS DATOS DE LA COTIZACION
  getDetallesCotiza(){
    this._route.params.subscribe( params =>{
      let id = + params['idCotiza'];
      //
      this._ventasService.getDetallesCotiza(id).subscribe(
        response =>{
          if(response.status == 'success'){
            this.cotizacion_editada.idCliente = response.Cotizacion[0]['idCliente'];
            this.cotizacion_editada.cdireccion = response.Cotizacion[0]['cdireccion'];
            this.productos_cotizacion_e = response.productos_cotiza;
            this.seleccionarCliente(this.cotizacion_editada.idCliente);
            if(this.cotizacion_editada.cdireccion.length > 0){
              this.seEnvia == true;
            }
          }
          console.log(this.cotizacion_editada);
          console.log(this.productos_cotizacion_e);
        },error =>{
          console.log(error);
        }
      )
    });
  }
  //TRAEMOS LA INFORMACION DE LA EMPRESA / SUCURSAL
  getDatosEmpresa(){
    this._empresaService.getDatosEmpresa().subscribe( 
      response => {
        if(response.status == 'success'){
           this.empresa = response.empresa;
           //console.log(this.empresa)
        }
      },error => {console.log(error)});
  }
  //traemos informacion de todos los clientes
  getClientes(){
    this.isLoadingClientes = true;
    this._clienteService.getAllClientes().subscribe( 
      response =>{
        if(response.status == 'success'){
          this.clientes = response.clientes;
          this.isLoadingClientes = false;
        }
      }, error =>{
        console.log(error);
      });
  }
  //traemos la informacion del cliente seleccionado del modal o el cliente que ya trae la cotizacion
  seleccionarCliente(idCliente:any){
    this._clienteService.getDetallesCliente(idCliente).subscribe( 
      response =>{
        if(response.status == 'success'){
          this.cliente = response.cliente;
          this.cotizacion_editada.nombreCliente = this.cliente[0]['nombre']+' '+this.cliente[0]['aPaterno']+' '+this.cliente[0]['aMaterno'];
        }else{
          console.log('Algo salio mal '+response);
        }
      }, error =>{
        console.log( error);
      });
  }
}
