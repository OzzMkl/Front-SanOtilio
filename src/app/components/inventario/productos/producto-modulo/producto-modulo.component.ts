import { Component, OnInit, OnDestroy } from '@angular/core';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
//primeng
import { MessageService, MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-producto-modulo',
  templateUrl: './producto-modulo.component.html',
  styleUrls: ['./producto-modulo.component.css'],
  providers: [EmpleadoService, MessageService]
})
export class ProductoModuloComponent implements OnInit {

  //breadcrumb
  items: MenuItem[] = [];
  home: MenuItem = {label: 'Inicio', icon: 'pi pi-home me-1', routerLink: '/'};
  //PERMISOS
  public userPermisos:  any ;
  public mInv = this._modulosService.modsInventario();

  constructor( 
      private _empleadoService: EmpleadoService, 
      private _modulosService: ModulosService,
      private _route: ActivatedRoute,
      private _breadcrumbService: BreadcrumbService,
  ) {}


  ngOnInit(): void {
    this.loadUser();

    this._breadcrumbService.initializeBreadcrumb(
      this._route,[
        {
          label: 'Inventario',
          icon: 'pi pi-table me-1',
        },{
          label: 'Productos',
          icon: 'pi pi-th-large me-1',
          routerLink: 'producto-buscar',
        }
      ],
      (items: MenuItem[]) => this.items = items
    );
  }

  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo(this.mInv.idModulo, this.mInv.idSubModulo);
  }

}