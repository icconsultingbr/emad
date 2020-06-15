import { Input } from "@angular/core";

export class Log{
    id:Number;
    @Input() dataCriacao: string;
    @Input() idUsuario : Number;
    @Input() entrada : string;
    @Input() saida : string;
    @Input() functionalidade : string;
    @Input() acao : string;
    @Input() idEstabelecimento : Number;

    
}