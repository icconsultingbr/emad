import { Input } from '@angular/core';

export class ItemExame {
    id: Number;
    @Input() idExame: number;
    @Input() nomeExame: string;
    @Input() idProdutoExame: number;
    @Input() nomeProdutoExame: string;
    @Input() idMetodoExame: number;
    @Input() nomeMetodoExame: string;
    @Input() resultado: number;
    @Input() nomeResultado: string;
    @Input() situacao: number;
}
