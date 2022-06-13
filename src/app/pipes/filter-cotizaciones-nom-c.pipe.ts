import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCotizacionesNomC'
})
export class FilterCotizacionesNomCPipe implements PipeTransform {

  transform(value: any, arg:any): any {
    if(arg == '' || arg.lenght < 3 ) return value;
    const result = [];
    for( const c of value){
      if(c.nombreCliente.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        result.push(c);
      }
    }
    return result;
  }

}
