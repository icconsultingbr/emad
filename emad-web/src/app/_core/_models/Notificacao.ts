import { Input } from "@angular/core";

export class Notificacao{
    id:Number;
    @Input() titulo: string;
    @Input() descricao: string;
    @Input() idUsuarioCriacao : Number;
    @Input() idTipoUsuario : Number;
    @Input() idUsuario : Number;
    @Input() tipo : string;
    @Input() tipoFormatado : string;
    @Input() dataCriacao:Date;
    @Input() dataCancelamento:Date;
    @Input() motivoCancelamento:string;
}