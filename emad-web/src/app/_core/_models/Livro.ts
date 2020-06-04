import { Input } from "@angular/core";

export class Livro {
    id: Number;
    @Input() livro: string;
    @Input() situacao: Boolean;
}