import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//Servicios
import { ProveedorService } from 'src/app/services/proveedor.service';
import { ProductoService } from 'src/app/services/producto.service';
import { global } from 'src/app/services/global';
import { ToastService } from 'src/app/services/toast.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { MedidaService } from 'src/app/services/medida.service';
import { ImpuestoService } from 'src/app/services/impuesto.service';
import { CompraService } from 'src/app/services/compra.service';
//modelos
import { Compra } from 'src/app/models/compra'
import { Producto_compra } from 'src/app/models/producto_compra';
//Modal
import { NgbDateStruct, NgbModal,ModalDismissReasons, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
//pdf
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-compra-editar',
  templateUrl: './compra-editar.component.html',
  styleUrls: ['./compra-editar.component.css'],
  providers:[ProveedorService,MedidaService,ProductoService,ImpuestoService,EmpleadoService,CompraService]
})
export class CompraEditarComponent implements OnInit {

  //variables servicios
  public url: string = global.url;
  public compra: Compra;
  public producto_compra: Producto_compra;
  public Lista_compras: Array<Producto_compra>;
  public detailComp: any;

  constructor(
    //declaracion de servicios
    private _proveedorService: ProveedorService,
    private _productoService: ProductoService,
    public toastService: ToastService,
    public _empleadoService : EmpleadoService,
    private _route: ActivatedRoute,
    private modalService: NgbModal,

    private _medidaService: MedidaService,
    private _impuestoService: ImpuestoService,
    public _compraService : CompraService,
    private calendar: NgbCalendar
  ) {
      this.compra = new Compra(0,null,0,0,0,0,0,0,null,'',null);
      this.producto_compra = new Producto_compra(0,0,0,0,0,0,null,null,null,null,null,null,0,null);
      this.Lista_compras = [];
      this.url = global.url;
    
   }

  ngOnInit(): void {
    this.getCompra();
  }

  getCompra(){
    this._route.params.subscribe( params =>{
      let id = + params['idCompra'];//la asignamos en una variable
      console.log('id',id);
      //Mandamos a traer la informacion de la orden de compra
      this._compraService.getDetailsCompra(id).subscribe(
        response =>{
          if(response.status  == 'success' && response.compra.length > 0 && response.productos.length > 0){
            console.log('---INFORMACION DE COMPRA---');
            console.log('response.compra',response.compra);
            console.log('response.productos',response.productos);
            console.log('---------------------------------');
            //Asignacion en variables para poder editar
            //asignamos de uno en uno las propiedades de la compra
            this.Lista_compras = response.prodcutos;
            console.log('lista compras',this.Lista_compras);
            this.compra.idCompra = response.compra[0]['idCompra'];
            this.compra.idOrd = response.compra[0]['idOrd'];
            this.compra.idProveedor = response.compra[0]['idProveedor'];
            this.compra.folioProveedor = response.compra[0]['folioProveedor'];
            this.compra.subtotal = response.compra[0]['subtotal'];
            this.compra.total = response.compra[0]['total'];
            this.compra.idEmpleadoR = response.compra[0]['idEmpleadoR'];
            this.compra.idStatus = response.compra[0]['idStatus'];
            this.compra.fechaRecibo = response.compra[0]['fechaRecibo'];
            this.compra.observaciones = response.compra[0]['observaciones'];




          }
          

        },error =>{
          console.log(error);
      });
    });
  }



}
