import { Input } from "@angular/core";

export class Log{
    id:Number;
    @Input() dataCriacao: String;
    @Input() idUsuario : Number;
    @Input() entrada : String;
    @Input() saida : String;
    @Input() functionalidade : String;
    @Input() acao : String;
    @Input() idEstabelecimento : Number;

    
}