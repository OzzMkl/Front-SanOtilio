import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterProveedores'
})
export class FilterProveedoresPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    if(arg == '' || arg.lenght < 3) return value;
    const resultProve =[];
    for(const p of value){
      if(p.nombre.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        resultProve.push(p);
      };
    };
    return resultProve;
  }

}
