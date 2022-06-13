import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterVendedor'
})
export class FilterVendedorPipe implements PipeTransform {

  transform(value: any, arg:any): any {
    if(arg == '' || arg.lenght < 3 ) return value;
    const result = [];
    for( const c of value){
      if(c.nombreEmpleado.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        result.push(c);
      }
    }
    return result;
  }

}
