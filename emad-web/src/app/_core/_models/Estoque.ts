import { Input } from "@angular/core";

export class Estoque {
    id: Number;
    @Input() idFabricanteMaterial: number;
    @Input() idMaterial: number;
    @Input() idEstabelecimento: number = +JSON.parse(localStorage.getItem("est"))[0].id;
    @Input() lote: string;
    @Input() validade: Date;
    @Input() quantidade: number;
    @Input() bloqueado: boolean;
    @Input() motivoBloqueio: string;
    @Input() dataBloqueio: Date;
    @Input() idUsuarioBloqueio: number;
    @Input() situacao: Boolean;
}