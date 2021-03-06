import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterClientes'
})
export class FilterClientesPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    if(arg == '' || arg.lenght < 3) return value;
    const result =[];
    for(const c of value){
      let namess = c.nombre+' '+c.aPaterno+' '+c.aMaterno;
      if(namess.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        result.push(c);
      };
    };
    return result;
  }

}
