import { Component, OnInit, OnDestroy } from '@angular/core';
//servicios
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
//primeng
import { MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ventas-realizadas-modulo',
  templateUrl: './ventas-realizadas-modulo.component.html',
  styleUrls: ['./ventas-realizadas-modulo.component.css'],
  providers:[EmpleadoService, MessageService],
})
export class VentasRealizadasModuloComponent implements OnInit, OnDestroy {

  //breadcrumb
  items: MenuItem[] = [];
  home: MenuItem = {label: 'Inicio', icon: 'pi pi-home me-1', routerLink: '/'};
  //PERMISOS
  public userPermisos:any;
  public mPuV = this._modulosService.modsPuntodeVenta();

  constructor(
      private _empleadoService:EmpleadoService,
      private _modulosService: ModulosService,
      private _route: ActivatedRoute,
      private _breadcrumbService: BreadcrumbService,
    ) { }

  ngOnInit(): void {
    this.loadUser();

    this._breadcrumbService.initializeBreadcrumb(
      this._route,
      [{
        label: 'Ventas',
        icon: 'pi pi-dollar me-1',
      },{
        label: 'Ventas',
        icon: 'pi pi-shopping-cart me-1',
        routerLink: 'proveedorBuscar',
      }],
      (items: MenuItem[]) => this.items = items
    );
  }

  ngOnDestroy(): void {
    this._breadcrumbService.ngOnDestroy();
  }

  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo(this.mPuV.idModulo, this.mPuV.idSubModulo);
  }

}
