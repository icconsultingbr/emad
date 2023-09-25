import { Pipe, PipeTransform } from '@angular/core';
import { AppGridViewComponent } from './app-grid-view.component';

@Pipe({
    name: 'filtroAppGridView'
})
export class FiltroAppGridView implements PipeTransform {
    transform(items: any[], items2: any[], args: string, fields: any[]) {

        if (typeof items === 'object') {
            let resultArray = [];
            if (args.length === 0) {
                resultArray = items;
            } else {
                for (const item of items2) {

                    let match = false;
                    for (const field of fields ) {
                        if ( typeof item[field.field] === 'string') {
                            if (item[field.field] != null && field.grid && item[field.field].match(new RegExp('' + args, 'i'))) {
                                match = true;
                                break;
                            }
                        } else if ( typeof item[field.field] === 'number') {
                            if (item[field.field] != null && field.grid && ((item[field.field] + '').indexOf(args) > -1)) {
                                match = true;
                                break;
                            }
                        }

                    }
                    if (match) {
                        resultArray.push(item);
                    }
                }
            }

            return resultArray;
        } else {
            return null;
        }
    }
}
