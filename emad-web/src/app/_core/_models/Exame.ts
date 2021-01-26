import { Input } from "@angular/core";
import { ItemReceita } from "./ItemReceita";

export class Exame {
    id: Number;
    @Input() idEstabelecimento: number = +JSON.parse(localStorage.getItem("est"))[0].id;
    @Input() idPaciente: number;
    @Input() nomePaciente: string;    
    @Input() situacao: string;
    @Input() idTipoExame: number;    
    @Input() itensReceita: ItemReceita[] = [];      
    @Input() itensReceitaFinalizado: ItemReceita[] = [];  
    @Input() acao: string;
    @Input() mensagemPaciente: string;    
}