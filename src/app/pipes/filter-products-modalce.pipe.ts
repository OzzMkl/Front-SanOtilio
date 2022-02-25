import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterProductsModalce'
})
export class FilterProductsModalcePipe implements PipeTransform {

  transform(value: any, arg: any): any {
    if(arg == '' || arg.lenght < 3) return value;
    const resultProduct =[];
    for(const pr of value){
      if(pr.claveEx.toLowerCase().indexOf(arg.toLowerCase()) > -1){
        resultProduct.push(pr);
      };
    };
    return resultProduct;
  }

}
