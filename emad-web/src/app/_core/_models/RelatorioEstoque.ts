import { Input } from "@angular/core";

export class RelatorioEstoque {
    id: Number;
    @Input() idFabricanteMaterial: number;
    @Input() idMaterial: number;
    @Input() nomeMaterial: string = "";
    @Input() nomeLote: string = "";
    @Input() idEstabelecimento: number = +JSON.parse(localStorage.getItem("est"))[0].id;
    @Input() nomeEstabelecimento: string = JSON.parse(localStorage.getItem("est"))[0].nomeFantasia;
    @Input() lote: string;
    @Input() validade: Date;
    @Input() quantidade: number;
    @Input() bloqueado: boolean;
    @Input() motivoBloqueio: string;
    @Input() dataBloqueio: Date;
    @Input() idUsuarioBloqueio: number;
    @Input() situacao: Boolean;
    @Input() estoqueAbaixoMinimo: string = "N";
}