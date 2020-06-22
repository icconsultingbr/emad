import { Input } from "@angular/core";

export class SubgrupoOrigem {
    id: Number;
    @Input() idGrupoOrigem: number;
    @Input() nome: string;
    @Input() exibirCidade: boolean;
    @Input() situacao: Boolean;
}