import { Component, OnInit } from '@angular/core';
//servicio
import { CajasService } from 'src/app/services/cajas.service';

@Component({
  selector: 'app-corte-de-caja',
  templateUrl: './corte-de-caja.component.html',
  styleUrls: ['./corte-de-caja.component.css']
})
export class CorteDeCajaComponent implements OnInit {

  //
  public  sesiones:any
  constructor(private _cajaService: CajasService) { }

  ngOnInit(): void {
    this.getVerificaSesionesCaja()
  }

  getVerificaSesionesCaja(){
    this._cajaService.verificaSesionCaja().subscribe(
      response => {
        this.sesiones = response.caja
        console.log(this.sesiones)
      }
    )
  }

}
