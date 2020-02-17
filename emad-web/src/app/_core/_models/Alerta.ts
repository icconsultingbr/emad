import { Input } from "@angular/core";

export class Alerta{
    id:Number;
    @Input() titulo: string;
    @Input() descricao: string;
    @Input() tipo : string;
    @Input() url : string;
    @Input() tipoFormatado : string;
    @Input() novo : number;
    @Input() data : string;

    public getCor():String{
        let cor = 'info';
        if(this.tipo == 'N'){
            cor = 'info';
        }
        if(this.tipo == 'A'){
            cor = 'warning';
        }
        if(this.tipo == 'V'){
            cor = 'danger';
        }
        return cor;
    }
}