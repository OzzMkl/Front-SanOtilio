/**
 *  @fileoverview Logica del componente login
 * 
 *  @version 1.0
 * 
 *  @autor Oziel pacheco<ozielpacheco.m@gmail.com>
 *  @copyright Materiales San Otilio
 * 
 *  @History
 * 
 *  -Primera version escrita por Oziel Pacheco
 * 
 */
import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/models/empleado';
import { EmpleadoService } from '../../services/empleado.service';
import { Router, ActivatedRoute} from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [EmpleadoService]
})
export class LoginComponent implements OnInit {

  
  public empleado: Empleado;
  public status: any;
  public token: any;
  public identity: any;

  constructor(
    private _empleadoService: EmpleadoService,
    private _router: Router,
    private _route: ActivatedRoute,
    private toastService: ToastService
  ) { 
    
    this.empleado = new Empleado(1,'','','ROLE_USER','','','','','','','','','','',1,1,1,1,'','',1,1);
    this.status ="";
  }

  ngOnInit(): void {
    //este metodo se ejecuta siempre y cierra sesion solo cuando le llega el parametro sure por la url
    this.logout();
  }

  /**
   * 
   * @param form 
   * Recibe los valores del form
   * @description
   * 
   */
  onSubmit(form:any){
    
    this._empleadoService.signup(this.empleado).subscribe(
      response => {
        
        //recibimos el token si no es error claro
        if(response.status != 'error'){
        
            this.status = 'success';//marcamos el status como bueno
            this.token = response;//lo asignamos a response
              //objeto usuario identificado
               this._empleadoService.signup(this.empleado, this.status).subscribe(//Realizamos nuevamente la peticion para traer los datos ya que en el anterior solo obtenemos el token
                    response => {
                          this.identity = response;//obtenemos los datos
                          //console.log(this.token);
                          //console.log(this.identity);
                          //con esto percistimos los datos del usuario identificado
                          localStorage.setItem('token', this.token);//guardamos el token localmente en la memoria del navegador
                          localStorage.setItem('identity', JSON.stringify(this.identity));//guardamos la identidad y convertimos el objeto javascript a un objeto json
                          //redireccionamos a pagina principal
                          this._router.navigate(['']);
                    },
                    error =>{
                      this.status = 'error',
                      console.log(<any>error);
                    }
                  );
        }else{
          this.status = 'error';
          this.toastService.show('Email y/o contraseña incorrectos',{classname: 'bg-danger text-light', delay: 5000});
        }
      },
      error =>{
        this.status = 'error',
        console.log(error);
        
      }
    );
  }

  logout(){//cerar sesiion
    //accedemps a activatedrute obtenemos parametros y subcribe por ser un observable ademas este contotiene un callback
    this._route.params.subscribe(Params => {
      let logout = +Params['sure'];//accedemos al parametro sure y lo casteamos para convetrirlo a numero
      if(logout == 1){
          localStorage.removeItem('identity');//destruimos la informacion almacenada
          localStorage.removeItem('token');
          //vaciamos las propiedades
          this.identity = null;
          this.token = null;
          //redireccionamos a pagina principal
          this._router.navigate(['']);
      }
    });
  }

}
