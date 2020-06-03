import { Input } from "@angular/core";

export class ModeloCaneta {
    id: Number;
    @Input() nome: String;
    @Input() situacao : Boolean;
}