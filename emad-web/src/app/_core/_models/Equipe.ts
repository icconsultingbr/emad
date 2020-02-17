import { Input } from "@angular/core";

export class Equipe {
    id: Number;
    @Input() equipe: String;
    @Input() cnes: String;
    @Input() nome: String;
    @Input() tipo: String;
    @Input() situacao: Boolean;
    @Input() idEstabelecimento: Number;
    @Input() idEquipeEmap: Number;
    @Input() profissionais : any[];
}