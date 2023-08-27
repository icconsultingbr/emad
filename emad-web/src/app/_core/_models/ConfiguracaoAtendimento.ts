import { Input } from "@angular/core";

export class ConfiguracaoAtendimento {
    id: Number;
    @Input() idEstabelecimento: number;
    @Input() estabelecimento: string;
    @Input() especialidade: string;
    @Input() tipoFicha: string;
    @Input() perguntas: string;
}