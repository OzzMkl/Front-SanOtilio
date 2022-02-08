import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterProduct'
})
export class FilterProductPipe implements PipeTransform {

  transform(value: any, arg: any): any {
    if(arg == '' || arg.lenght < 3) return value;
    const resultProduct =[];
    for(const pr of value){
      if(pr.descripcion.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        resultProduct.push(pr);
      };
    };
    return resultProduct;
  }

}
