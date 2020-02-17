import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefone'
})
export class TelefonePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(typeof value != 'undefined'){
      value = value.toString();
    if (value.length === 11) {
      return "(".concat(value.substring(0, 2)).concat(") ")
        .concat(value.substring(2, 7))
        .concat("-")
        .concat(value.substring(7, 11))
    }
    if (value.length === 10) {
      return "(".concat(value.substring(0, 2)).concat(") ")
        .concat(value.substring(2, 6))
        .concat("-")
        .concat(value.substring(6, 10))
    }
    return value;

    }
    
  }

}
