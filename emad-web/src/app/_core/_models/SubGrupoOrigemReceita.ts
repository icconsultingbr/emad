import { Input } from "@angular/core";

export class SubGrupoOrigemReceita {
    id: Number;
    @Input() idGrupoOrigemReceita: number;
    @Input() nome: string;
    @Input() exibirCidade: boolean;
    @Input() situacao: Boolean;
}