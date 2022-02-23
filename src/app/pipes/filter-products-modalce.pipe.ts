import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterProductsModalce'
})
export class FilterProductsModalcePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
