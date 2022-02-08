import { Component, OnInit, DoCheck } from '@angular/core';
import { EmpleadoService } from './services/empleado.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [EmpleadoService]
})
export class AppComponent implements OnInit, DoCheck{
  title = 'Sistema San Otilio';
  public identity: any;
  public token:any;

  constructor(
    public _empleadoService : EmpleadoService
  ){
    this.loadUser();
  }
  ngOnInit(){
    // console.log('web carada correctaetne');
  }
  ngDoCheck(){
    this.loadUser();
  }
  loadUser(){
    this.identity = this._empleadoService.getIdentity();
    this.token =  this._empleadoService.getToken();
  }


}
