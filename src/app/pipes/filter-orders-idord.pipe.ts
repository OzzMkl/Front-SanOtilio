import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterOrdersIdord'
})
export class FilterOrdersIdordPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    if(arg == '' || arg.lenght < 3) return value;
    const result =[];
    for(const oc of value){
      if(oc.idOrd.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        result.push(oc);
      };
    };
    return result;
  }

}
