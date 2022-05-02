import { Input } from "@angular/core";

export class Procedimento {
    id: number;
    @Input() co_procedimento: string;
    @Input() no_procedimento: string;
    @Input() dt_competencia: string;
    @Input() qtd: number;
}