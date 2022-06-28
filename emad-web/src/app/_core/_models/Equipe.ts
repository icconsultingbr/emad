import { Input } from "@angular/core";

export class Equipe {
    id: Number;
    @Input() equipe: string;
    @Input() ine: string;
    @Input() nome: string;
    @Input() tipo: string;
    @Input() situacao: Boolean;
    @Input() idEstabelecimento: Number = +JSON.parse(localStorage.getItem("est"))[0].id;
    @Input() idEquipeEmap: Number;
    @Input() profissionais : any[];
}