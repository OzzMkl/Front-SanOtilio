import { Component, OnInit, OnDestroy } from '@angular/core';
//servicio
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
//primeng
import { MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-proveedor-modulo',
  templateUrl: './proveedor-modulo.component.html',
  styleUrls: ['./proveedor-modulo.component.css'],
  providers: [EmpleadoService, MessageService]
})
export class ProveedorModuloComponent implements OnInit, OnDestroy {

  //breadcrumb
  items: MenuItem[] = [];
  home: MenuItem = {label: 'Inicio', icon: 'pi pi-home me-1', routerLink: '/'};

  //PERMISOS
  public userPermisos:  any ;
  public mProv = this._modulosService.modsProveedores();
  
  constructor(
    private _empleadoService: EmpleadoService, 
    private _modulosService: ModulosService,
    private _route: ActivatedRoute,
    private _breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this._breadcrumbService.initializeBreadcrumb(
      this._route,
      [{
        label: 'Compras',
        icon: 'pi pi-briefcase me-1',
      },{
        label: 'Proveedores',
        icon: 'pi pi-users me-1',
        routerLink: 'proveedorBuscar',
      }],
      (items: MenuItem[]) => this.items = items
    );
  }

  ngOnDestroy(): void {
    this._breadcrumbService.ngOnDestroy();
  }

  loadUser(): void{
    this.userPermisos = this._empleadoService.getPermisosModulo(this.mProv.idModulo,this.mProv.idSubModulo);
  }

}