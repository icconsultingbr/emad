import { Input } from "@angular/core";

export class Equipe {
    id: Number;
    @Input() equipe: string;
    @Input() cnes: string;
    @Input() nome: string;
    @Input() tipo: string;
    @Input() situacao: Boolean;
    @Input() idEstabelecimento: Number;
    @Input() idEquipeEmap: Number;
    @Input() profissionais : any[];
}