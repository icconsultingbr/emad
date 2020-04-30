import { Input } from "@angular/core";

export class Caneta {
    id: Number;
    @Input() modelo: String;
    @Input() serial: String;
    @Input() situacao: Boolean;
    @Input() idEstabelecimento : Number = +JSON.parse(localStorage.getItem("est"))[0].id;
}