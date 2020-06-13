import { Input } from "@angular/core";

export class ModeloCaneta {
    id: Number;
    @Input() nome: string;
    @Input() situacao : Boolean;
}