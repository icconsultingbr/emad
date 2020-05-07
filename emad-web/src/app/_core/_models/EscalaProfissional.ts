import { Input } from "@angular/core";

export class EscalaProfissional {
    id: Number;
    @Input() idProfissional: Number;    
    @Input() anoMes: Number;  
    @Input() domingoHorarioInicial: String;
    @Input() domingoHorarioFinal: String;
    @Input() segundaHorarioInicial: String;
    @Input() segundaHorarioFinal: String;
    @Input() tercaHorarioInicial: String;
    @Input() tercaHorarioFinal: String;
    @Input() quartaHorarioInicial: String;
    @Input() quartaHorarioFinal: String;
    @Input() quintaHorarioInicial: String;
    @Input() quintaHorarioFinal: String;
    @Input() sextaHorarioInicial: String;
    @Input() sextaHorarioFinal: String;
    @Input() sabadoHorarioInicial: String;
    @Input() sabadoHorarioFinal: String;
}

export class EscalaProfissionalAnoMes {  
    @Input() idMesEscala: Number;  
}