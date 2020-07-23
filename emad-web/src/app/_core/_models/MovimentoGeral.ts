import { Input } from "@angular/core";

export class MovimentoGeral {
    id: number;
    @Input() idTipoMovimento: number;
    @Input() idMovimentoEstornado: number;
    @Input() idUsuario: number;
    @Input() idEstabelecimento: number = +JSON.parse(localStorage.getItem("est"))[0].id;
    @Input() nomeEstabelecimento: string = JSON.parse(localStorage.getItem("est"))[0].nomeFantasia;
    @Input() idReceita: number;
    @Input() idPaciente: number;
    @Input() numeroDocumento: number;
    @Input() numeroEmpenho: number;
    @Input() dataMovimento: Date;
    @Input() motivo: string;
    @Input() idPacienteOrigem: number;
    @Input() codigoDistribuidor: number;
    @Input() situacao: Boolean;
    @Input() itensMovimento: ItemMovimentoGeral[] = [];   
}

export class ItemMovimentoGeral {
    id: number;
    @Input() idMovimentoGeral: number;
    @Input() idFront: string;
    @Input() idMaterial: number;
    @Input() idLoteAtual: number;
    @Input() nomeMaterial: string;
    @Input() idFabricante: number;
    @Input() nomeFabricante: string;
    @Input() lote: string;
    @Input() validade: Date;    
    @Input() quantidade: number;
    @Input() quantidadeAtual: number;
    @Input() idItemReceita: number;
    @Input() idUsuarioAutorizador: number;
    @Input() itemSolicitacaoRemanejamento: number;
    @Input() quantidadeDispensadaAnterior: number;
    @Input() situacao: Boolean;  
}