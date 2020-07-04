import { Input } from "@angular/core";
import { ItemReceita } from "./ItemReceita";

export class Receita {
    id: Number;
    @Input() idEstabelecimento: number = +JSON.parse(localStorage.getItem("est"))[0].id;
    @Input() idUf: number;
    @Input() idMunicipio: number;
    @Input() idProfissional: number;
    @Input() idPaciente: number;
    @Input() idSubgrupoOrigem: number = 1;
    @Input() ano: number = new Date().getFullYear();
    @Input() numero: number;
    @Input() nomePaciente: string;    
    @Input() dataEmissao: Date;
    @Input() dataUltimaDispensacao: Date;
    @Input() idMotivoFimReceita: number;
    @Input() idPacienteOrigem: number;
    @Input() idMandadoJudicial: number;
    @Input() situacao: string;
    @Input() textoCidade: string;
    @Input() itensReceita: ItemReceita[] = [];      
    @Input() itensReceitaFinalizado: ItemReceita[] = [];  
    @Input() acao: string;
}

