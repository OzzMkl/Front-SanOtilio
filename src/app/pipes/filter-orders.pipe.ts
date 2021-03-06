import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterOrders'
})
export class FilterOrdersPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    if(arg == '' || arg.lenght < 3) return value;
    const result =[];
    for(const oc of value){
      if(oc.nombreProveedor.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        result.push(oc);
      };
    };
    return result;
  }

}
