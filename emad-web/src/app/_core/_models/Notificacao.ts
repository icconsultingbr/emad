import { Input } from "@angular/core";

export class Notificacao {
    id: Number;
    @Input() titulo: string;
    @Input() descricao: string;
    @Input() idTipoUsuario: number;
    @Input() url: string;
    @Input() tipo: string;
    @Input() dataCancelamento: Date;
    @Input() motivoCancelamento: string;
    @Input() dataDisponibilidade: Date;
    @Input() situacao: Boolean;
}