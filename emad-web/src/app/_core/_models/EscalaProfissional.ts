import { Input } from "@angular/core";

export class EscalaProfissional {
    id: Number;
    @Input() idProfissional: Number;    
    @Input() anoMes: Number;  
    @Input() domingoHorarioInicial: string;
    @Input() domingoHorarioFinal: string;
    @Input() segundaHorarioInicial: string;
    @Input() segundaHorarioFinal: string;
    @Input() tercaHorarioInicial: string;
    @Input() tercaHorarioFinal: string;
    @Input() quartaHorarioInicial: string;
    @Input() quartaHorarioFinal: string;
    @Input() quintaHorarioInicial: string;
    @Input() quintaHorarioFinal: string;
    @Input() sextaHorarioInicial: string;
    @Input() sextaHorarioFinal: string;
    @Input() sabadoHorarioInicial: string;
    @Input() sabadoHorarioFinal: string;
}

export class EscalaProfissionalAnoMes {  
    @Input() idMesEscala: Number;  
}