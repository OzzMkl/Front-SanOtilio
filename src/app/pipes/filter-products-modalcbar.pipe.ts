import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterProductsModalcbar'
})
export class FilterProductsModalcbarPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
