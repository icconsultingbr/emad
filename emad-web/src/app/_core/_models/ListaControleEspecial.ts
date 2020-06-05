import { Input } from "@angular/core";

export class ListaControleEspecial {
    id: Number;
    @Input() codigoLista: string;
    @Input() listaControleEspecial: string;
    @Input() idLivro: number;
    @Input() receitaControlada: boolean;
    @Input() medicamentoControlado: boolean;
    @Input() situacao: Boolean;
}