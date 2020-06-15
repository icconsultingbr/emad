import { Input, OnInit } from "@angular/core";

export class Menu {
    id : Number;
    @Input() nome : string;
    @Input() menuPai : Number;
    @Input() rota : string;
    @Input() icone : string; 
    @Input() situacao : Boolean;
}