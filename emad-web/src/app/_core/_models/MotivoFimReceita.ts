import { Input } from "@angular/core";

export class MotivoFimReceita {
    id: Number;
    @Input() motivo: string;
    @Input() situacao: Boolean;
}