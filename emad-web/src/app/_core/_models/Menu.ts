import { Input, OnInit } from "@angular/core";

export class Menu {
    id : Number;
    @Input() nome : String;
    @Input() menuPai : Number;
    @Input() rota : String;
    @Input() icone : String; 
    @Input() situacao : Boolean;
}