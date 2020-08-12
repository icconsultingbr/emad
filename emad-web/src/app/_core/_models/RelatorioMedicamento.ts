import { Input } from "@angular/core";

export class RelatorioMedicamento {    
    @Input() idMaterial: number;    
    @Input() nomeMaterial: string = "";
    @Input() ordenadoPor: string = "mvg.dataMovimento";
    @Input() idPaciente: string;
    @Input() nomePaciente: string;
    @Input() dataInicial: Date;
    @Input() dataFinal: Date;
    @Input() dataInicialFiltro: string;
    @Input() dataFinalFiltro: string;
    @Input() criteriosPesquisa: any;
    @Input() params: any;
    @Input() idEstabelecimento: number;
    @Input() nomeEstabelecimento: string;
    @Input() lote: string;
    @Input() idFabricante: number;
    @Input() nomeFabricanteMaterial: string;
}