import { Input } from "@angular/core";

export class AusenciaProfissional {
    id: Number;
    @Input() idProfissional: Number;    
    @Input() idTipoAusencia: Number;    
    @Input() periodoInicial: Date;
    @Input() periodoFinal: Date;
    @Input() situacao: Boolean;
}